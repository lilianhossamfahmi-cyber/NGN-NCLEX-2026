# Phase 6.5 Technical Specification: Smart Study Planner & Wellness System

## 1. Database Schema (PostgreSQL)

```sql
-- STUDY PLANNER MODULE

-- 1. Study Techniques (Lookup Table)
CREATE TABLE ngn_study_techniques (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL, -- e.g., 'Pomodoro Classic', 'Feynman Technique'
    description TEXT NOT NULL,
    difficulty_level INTEGER CHECK (difficulty_level BETWEEN 1 AND 5),
    effectiveness_rating DECIMAL(3, 1) CHECK (effectiveness_rating BETWEEN 1 AND 5),
    best_for_scenarios TEXT[], -- Array of strings
    metadata JSONB -- Instructions, timing details
);

-- 2. Study Plans
CREATE TABLE ngn_study_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES ngn_students(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    exam_date DATE NOT NULL,
    start_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'active', -- active, completed, abandoned, recovery_mode
    configuration JSONB NOT NULL, 
    -- { hours_per_day, weak_domains, techniques_preferred, wellness_priority }
    schedule_data JSONB NOT NULL, 
    -- The full generated calendar structure
    progress_metrics JSONB DEFAULT '{"total_sessions": 0, "completed_sessions": 0, "adherence_rate": 0}'
);

-- 3. Study Sessions (Individual blocks in the plan)
CREATE TABLE ngn_study_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plan_id UUID REFERENCES ngn_study_plans(id) ON DELETE CASCADE,
    student_id UUID REFERENCES ngn_students(id) ON DELETE CASCADE,
    scheduled_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- pending, in_progress, completed, skipped
    domains_covered TEXT[],
    technique_id UUID REFERENCES ngn_study_techniques(id),
    target_duration_minutes INTEGER,
    actual_duration_minutes INTEGER,
    questions_attempted INTEGER DEFAULT 0,
    questions_correct INTEGER DEFAULT 0,
    student_satisfaction INTEGER CHECK (student_satisfaction BETWEEN 1 AND 5),
    notes TEXT,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ
);

-- WELLNESS MODULE

-- 4. Wellness Exercises (Lookup Table)
CREATE TABLE ngn_wellness_exercises (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL, -- e.g., 'Box Breathing'
    category VARCHAR(50) NOT NULL, -- breathing, meditation, movement
    duration_seconds INTEGER NOT NULL,
    difficulty_level INTEGER CHECK (difficulty_level BETWEEN 1 AND 5),
    effectiveness_rating DECIMAL(3, 1),
    instructions TEXT NOT NULL, -- Markdown/Step-by-step
    benefits TEXT NOT NULL,
    when_to_use TEXT[],
    media_content JSONB -- { video_url, audio_url, script }
);

-- 5. Wellness Sessions (Tracking usage)
CREATE TABLE ngn_wellness_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES ngn_students(id) ON DELETE CASCADE,
    exercise_id UUID REFERENCES ngn_wellness_exercises(id),
    performed_at TIMESTAMPTZ DEFAULT NOW(),
    duration_seconds INTEGER, -- Actual time spent
    completed BOOLEAN DEFAULT false,
    stress_before INTEGER CHECK (stress_before BETWEEN 1 AND 10),
    stress_after INTEGER CHECK (stress_after BETWEEN 1 AND 10),
    mood_before VARCHAR(50),
    mood_after VARCHAR(50),
    user_feedback TEXT
);

-- 6. Wellness Dashboard (Daily Aggregates)
CREATE TABLE ngn_wellness_daily_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES ngn_students(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    stress_level_avg DECIMAL(3, 1),
    sleep_hours DECIMAL(3, 1),
    sleep_quality INTEGER CHECK (sleep_quality BETWEEN 1 AND 10),
    energy_level INTEGER CHECK (energy_level BETWEEN 1 AND 10),
    focus_quality INTEGER CHECK (focus_quality BETWEEN 1 AND 10),
    mood_rating INTEGER CHECK (mood_rating BETWEEN 1 AND 10),
    exercises_completed_count INTEGER DEFAULT 0,
    total_wellness_minutes INTEGER DEFAULT 0,
    UNIQUE(student_id, date)
);

-- 7. Recommendations
CREATE TABLE ngn_study_recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES ngn_students(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    trigger_context VARCHAR(100), -- 'high_stress', 'declining_performance'
    recommended_action_type VARCHAR(50), -- 'take_break', 'wellness_exercise', 'change_technique'
    recommended_entity_id UUID, -- ID formatted as string if needed
    accepted BOOLEAN DEFAULT false
);

-- Indices
CREATE INDEX idx_sessions_plan ON ngn_study_sessions(plan_id);
CREATE INDEX idx_sessions_date ON ngn_study_sessions(scheduled_date);
CREATE INDEX idx_wellness_student_date ON ngn_wellness_daily_metrics(student_id, date);
```

## 2. API Specifications

### Study Planner

**POST /api/v1/study-plans**
- **Body**: `{ exam_date, hours_per_day, weak_domains[], technique_ids[], wellness_preference }`
- **Response**: Returns generated `Plan` object with full `schedule`.

**PUT /api/v1/study-plans/:id/recovery**
- **Description**: Triggers regeneration of remaining sessions if behind.
- **Body**: `{ current_status_notes }` (optional)
- **Response**: Updated `Plan` object.

**POST /api/v1/study-sessions/:id/complete**
- **Body**: `{ actual_duration, satisfaction, questions_done, correct_count }`
- **Response**: Updates session status and recalculates plan progress.

### Wellness

**GET /api/v1/wellness-exercises**
- **Response**: List of all 12 exercises with full details.

**POST /api/v1/wellness-recommendations**
- **Body**: `{ current_stress, recent_quiz_score, session_duration }`
- **Response**: `{ recommended: boolean, exercise: Exercise | null, reason: string }`

**POST /api/v1/wellness-checkin**
- **Body**: `{ stress, sleep_hours, sleep_quality, mood, energy }`
- **Response**: Confirms save, returns updated daily dashboard stats.

## 3. Algorithms

### A. Study Plan Generation (Pseudocode)

```typescript
function generateStudyPlan(profile: StudentProfile): StudyPlan {
    const daysUntilExam = differenceInDays(profile.examDate, today);
    const totalHours = daysUntilExam * profile.hoursPerDay;
    
    // 1. Determine Intensity
    let phase = 'RELAXED'; // >30 days
    if (daysUntilExam < 7) phase = 'INTENSIVE';
    else if (daysUntilExam < 15) phase = 'MODERATE';
    
    // 2. Domain Allocation
    // Allocate 60% of time to Weakest 3 domains
    const weakTime = totalHours * 0.6;
    const balancedTime = totalHours * 0.4;
    
    // 3. Generate Daily Slots
    const days: DaySchedule[] = [];
    
    for (let day = 0; day < daysUntilExam; day++) {
        const date = addDays(today, day);
        
        // Rule: 1 Rest day every 7 days
        if (day > 0 && day % 7 === 0) {
            days.push({ date, type: 'REST', sessions: [] });
            continue;
        }
        
        // Assign Sessions
        const sessions = [];
        const dailyMinutes = profile.hoursPerDay * 60;
        let timeAllocated = 0;
        
        while (timeAllocated < dailyMinutes) {
            // Pick Domain (Weighted random choice: Weak domains have higher p)
            const domain = pickWeightedDomain(profile.weakDomains, profile.strongDomains);
            
            // Pick Technique (from user preferences or default relevant)
            const technique = pickTechnique(profile.preferences, domain);
            
            // Duration logic (standard block or based on technique)
            const duration = technique.name === 'Pomodoro' ? 120 : 60; // example
            
            // Add Wellness Break if needed (every 90 mins)
            if (timeAllocated > 0 && timeAllocated % 90 === 0) {
                 // Insert break marker in schedule
            }
            
            sessions.push({
                domain,
                technique,
                duration
            });
            timeAllocated += duration;
        }
        
        days.push({ date, type: 'STUDY', sessions });
    }
    
    return { days, phase, summary: {...} };
}
```

### B. Recommendation Engine (Decision Tree)

1. **Trigger Check**: run on dashboard load, post-quiz, and timer tick.
2. **Rules**:
   * **IF** `stress_level` (from check-in) > 7 
     * **THEN** Suggest: `Box Breathing` or `4-7-8 Breathing` (Immediate Calm).
   * **IF** `quiz_score` < 50% **AND** `consecutive_low_scores` >= 2
     * **THEN** Suggest: `Positive Affirmations` (Confidence Boost).
   * **IF** `study_session_duration` > 120 mins **AND** `breaks_taken` == 0
     * **THEN** Suggest: `Movement/Stretching` (Physical Reset).
   * **IF** `time` is "Late Night" **AND** `energy` < 4
     * **THEN** Suggest: `Sleep/Body Scan` (Don't push, rest).
   * **IF** `exam_date` is < 2 days
     * **THEN** Suppress "Hard" exercises, prioritize `Confidence/Grounding`.

## 4. Frontend Component Architecture

1.  **`StudyPlannerWizard` (Container)**
    *   `StepExamDate`
    *   `StepAvailability`
    *   `StepDomains`
    *   `StepTechniques`
    *   `StepWellness`
    *   `PlanGenerationView` (Loading/Results)

2.  **`WeeklyScheduleView`**
    *   `CalendarGrid`
    *   `DayColumn`
    *   `SessionCard` (Draggable)

3.  **`WellnessHub`**
    *   `WellnessDashboard` (Charts: Stress vs Perf)
    *   `ExerciseGrid` (Library)
    *   `ExercisePlayer` (Overlay/Modal)
        *   `VideoEmbed`
        *   `InstructionStepper`
        *   `BreathVisualizer` (Canvas/CSS anim)
    *   `DailyCheckIn` (Modal)

4.  **`SmartBanner`** (Global Component, listens to RecommendationService)

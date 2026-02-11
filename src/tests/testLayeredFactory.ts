/**
 * Test script for LayeredCaseStudyFactory
 * Run with: npx tsx src/tests/testLayeredFactory.ts
 */

import { LayeredCaseStudyFactory, GenerationConfig, LayerProgress } from '../services/LayeredCaseStudyFactory';

async function testLayeredGeneration() {
    console.log('='.repeat(60));
    console.log('🧪 TESTING 3-LAYER CASE STUDY FACTORY');
    console.log('='.repeat(60));
    console.log('');

    const config: GenerationConfig = {
        topic: 'Septic Shock',
        subTopic: 'Early Recognition and Intervention',
        difficulty: 3,
        patientAge: 'adult',
        setting: 'Emergency Department',
        onProgress: (progress: LayerProgress) => {
            const emoji = {
                1: '🏗️',
                2: '🔬',
                3: '🧪',
                4: '🩺',
                5: '✅'
            }[progress.layer as 1 | 2 | 3 | 4 | 5];
            console.log(`${emoji} Layer ${progress.layer}: [${progress.percent}%] ${progress.message}`);
        }
    };

    console.log('📋 Configuration:');
    console.log(`   Topic: ${config.topic}`);
    console.log(`   Sub-topic: ${config.subTopic}`);
    console.log(`   Difficulty: ${config.difficulty}/5`);
    console.log(`   Patient Age: ${config.patientAge}`);
    console.log(`   Setting: ${config.setting}`);
    console.log('');
    console.log('🚀 Starting generation...');
    console.log('');

    const startTime = Date.now();

    try {
        const result = await LayeredCaseStudyFactory.generate(config);

        const duration = ((Date.now() - startTime) / 1000).toFixed(1);

        console.log('');
        console.log('='.repeat(60));
        console.log('✅ GENERATION COMPLETE');
        console.log('='.repeat(60));
        console.log('');
        console.log(`⏱️  Duration: ${duration} seconds`);
        console.log('');

        // Validate the result
        console.log('📊 RESULT SUMMARY:');
        console.log('-'.repeat(40));
        console.log(`   ID: ${result.id}`);
        console.log(`   Type: ${result.typeId}`);
        console.log(`   Title: ${result.metadata?.title}`);
        console.log('');

        // Patient Info
        const patient = result.content?.clinicalData?.patientInfo;
        console.log('👤 PATIENT PROFILE:');
        console.log(`   Name: ${patient?.name}`);
        console.log(`   Age: ${patient?.age}`);
        console.log(`   Gender: ${patient?.gender}`);
        console.log(`   Allergies: ${patient?.allergies}`);
        console.log(`   Code Status: ${patient?.codeStatus}`);
        console.log('');

        // Clinical Data Stats
        const clinical = result.content?.clinicalData;
        console.log('📋 CLINICAL DATA:');
        console.log(`   Vital Sets: ${clinical?.vitals?.length || 0}`);
        console.log(`   Lab Results: ${clinical?.labs?.length || 0}`);
        console.log(`   Orders: ${clinical?.orders?.length || 0}`);
        console.log(`   H&P Length: ${clinical?.historyPhysical?.length || 0} chars`);
        console.log('');

        // Screen Summary
        const screens = result.content?.structure?.screens || [];
        console.log('📱 SCREENS:');
        screens.forEach((screen: any, idx: number) => {
            const cjmm = screen.cjmmStep || 'Unknown';
            const type = screen.type || 'Unknown';
            console.log(`   ${idx + 1}. [${cjmm}] ${type}`);
        });
        console.log('');

        // Rationale Check
        const rationale = result.content?.rationale;
        console.log('📚 RATIONALE:');
        console.log(`   Core Concept: ${rationale?.coreConcept?.substring(0, 50)}...`);
        console.log(`   Golden Rule: ${rationale?.goldenRule?.substring(0, 50)}...`);
        console.log(`   Pharmacology: ${rationale?.referenceInfo?.pharmacology ? '✅ Present' : '❌ Missing'}`);
        console.log(`   Physiology: ${rationale?.referenceInfo?.physiology ? '✅ Present' : '❌ Missing'}`);
        console.log(`   Anatomy: ${rationale?.referenceInfo?.anatomy ? '✅ Present' : '❌ Missing'}`);
        console.log('');

        // Quality Validation
        console.log('🔍 QUALITY CHECKS:');
        const checks = [
            { name: 'Has 6 screens', pass: screens.length === 6 },
            { name: 'Patient name not generic', pass: !['Patient', 'Client', 'John Doe'].includes(patient?.name) },
            { name: 'Has 3+ vital sets', pass: (clinical?.vitals?.length || 0) >= 3 },
            { name: 'Has 4+ lab results', pass: (clinical?.labs?.length || 0) >= 4 },
            { name: 'Has rationale', pass: !!rationale?.coreConcept },
            { name: 'Has pharmacology', pass: !!rationale?.referenceInfo?.pharmacology }
        ];

        checks.forEach(check => {
            console.log(`   ${check.pass ? '✅' : '❌'} ${check.name}`);
        });

        const passCount = checks.filter(c => c.pass).length;
        console.log('');
        console.log(`📈 Quality Score: ${passCount}/${checks.length} (${Math.round(passCount / checks.length * 100)}%)`);
        console.log('');

        // Save to file for inspection
        const fs = await import('fs');
        const outputPath = './test-output-case-study.json';
        fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
        console.log(`💾 Full output saved to: ${outputPath}`);
        console.log('');

        return result;

    } catch (error: any) {
        console.error('');
        console.error('❌ GENERATION FAILED');
        console.error('='.repeat(60));
        console.error(`Error: ${error.message}`);
        console.error('');
        console.error('Stack trace:');
        console.error(error.stack);
        throw error;
    }
}

// Run the test
testLayeredGeneration()
    .then(() => {
        console.log('🎉 Test completed successfully!');
        process.exit(0);
    })
    .catch((err) => {
        console.error('💥 Test failed:', err.message);
        process.exit(1);
    });

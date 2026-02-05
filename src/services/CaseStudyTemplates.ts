export interface SchemaTemplate {
    vitalsCount: number;
    labsCount: number;
    notesCount: number;
    ordersCount: number;
    radiologyCount: number;
    hpWords: [number, number]; // [min, max]
    s1Spans: number;
    s2Rows: number;
    s4Counts: { actions: number; conditions: number; parameters: number };
    s5Dropdowns: number;
    s6Options: number;
}

export const DIFFICULTY_TEMPLATES: Record<number, SchemaTemplate> = {
    1: {
        vitalsCount: 2,
        labsCount: 4,
        notesCount: 1,
        ordersCount: 4,
        radiologyCount: 0,
        hpWords: [100, 150],
        s1Spans: 6,
        s2Rows: 4,
        s4Counts: { actions: 4, conditions: 3, parameters: 4 },
        s5Dropdowns: 2,
        s6Options: 5
    },
    2: {
        vitalsCount: 2,
        labsCount: 5,
        notesCount: 1,
        ordersCount: 5,
        radiologyCount: 1,
        hpWords: [150, 200],
        s1Spans: 8,
        s2Rows: 4,
        s4Counts: { actions: 4, conditions: 3, parameters: 4 },
        s5Dropdowns: 2,
        s6Options: 6
    },
    3: {
        vitalsCount: 3,
        labsCount: 7,
        notesCount: 2,
        ordersCount: 6,
        radiologyCount: 1,
        hpWords: [200, 250],
        s1Spans: 10,
        s2Rows: 6,
        s4Counts: { actions: 5, conditions: 4, parameters: 5 },
        s5Dropdowns: 2,
        s6Options: 8
    },
    4: {
        vitalsCount: 4,
        labsCount: 10,
        notesCount: 3,
        ordersCount: 8,
        radiologyCount: 2,
        hpWords: [250, 350],
        s1Spans: 12,
        s2Rows: 7,
        s4Counts: { actions: 6, conditions: 4, parameters: 6 },
        s5Dropdowns: 3,
        s6Options: 9
    },
    5: {
        vitalsCount: 4,
        labsCount: 12,
        notesCount: 3,
        ordersCount: 10,
        radiologyCount: 2,
        hpWords: [300, 400],
        s1Spans: 14,
        s2Rows: 8,
        s4Counts: { actions: 6, conditions: 4, parameters: 6 },
        s5Dropdowns: 3,
        s6Options: 10
    }
};

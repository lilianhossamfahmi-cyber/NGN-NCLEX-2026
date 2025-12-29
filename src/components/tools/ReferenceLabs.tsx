import React, { useState } from 'react';
import './ToolSuite.css';

type LabCategory = {
    category: string;
    description: string;
    color: string; // Header background color
    items: { test: string; normal: string }[];
};

const LAB_DATA: LabCategory[] = [
    {
        category: 'Hematology (CBC)',
        description: 'Complete Blood Count',
        color: '#fecaca', // Light Red
        items: [
            { test: 'RBC (Red Blood Cells)', normal: '4.7 - 6.1 (M) / 4.2 - 5.4 (F) x 10^6/µL' },
            { test: 'Hemoglobin (Hgb)', normal: '14 - 18 (M) / 12 - 16 (F) g/dL' },
            { test: 'Hematocrit (Hct)', normal: '42 - 52% (M) / 37 - 47% (F)' },
            { test: 'WBC (White Blood Cells)', normal: '5,000 - 10,000 /mm3' },
            { test: 'Platelets', normal: '150,000 - 400,000 /mm3' },
            { test: 'ESR (Erythrocyte Sedimentation Rate)', normal: '< 15 (M) / < 20 (F) mm/hr' },
        ]
    },
    {
        category: 'Chemistry & Electrolytes',
        description: 'BMP / CMP',
        color: '#bae6fd', // Light Blue
        items: [
            { test: 'Sodium (Na+)', normal: '135 - 145 mEq/L' },
            { test: 'Potassium (K+)', normal: '3.5 - 5.0 mEq/L' },
            { test: 'Chloride (Cl-)', normal: '98 - 106 mEq/L' },
            { test: 'Carbon Dioxide (CO2)', normal: '23 - 30 mEq/L' },
            { test: 'Calcium (Total)', normal: '9.0 - 10.5 mg/dL' },
            { test: 'Magnesium (Mg2+)', normal: '1.3 - 2.1 mEq/L' },
            { test: 'Phosphorus (PO4)', normal: '3.0 - 4.5 mg/dL' },
            { test: 'Glucose (Fasting)', normal: '70 - 105 mg/dL' },
            { test: 'HgbA1c', normal: '< 5.7% (Pre: 5.7-6.4%)' },
        ]
    },
    {
        category: 'Kidney Function',
        description: 'Renal Panel',
        color: '#ddd6fe', // Light Violet
        items: [
            { test: 'BUN (Blood Urea Nitrogen)', normal: '10 - 20 mg/dL' },
            { test: 'Creatinine (SCr)', normal: '0.6 - 1.2 (M) / 0.5 - 1.1 (F) mg/dL' },
            { test: 'GFR (Glomerular Filtration Rate)', normal: '> 90 mL/min' },
            { test: 'Creatinine Clearance', normal: '85 - 125 (M) / 75 - 115 (F) mL/min' },
        ]
    },
    {
        category: 'Coagulation',
        description: 'Clotting Factors',
        color: '#fde68a', // Light Amber
        items: [
            { test: 'PT (Prothrombin Time)', normal: '11 - 12.5 seconds' },
            { test: 'INR (No Therpy)', normal: '0.8 - 1.1' },
            { test: 'INR (Warfarin)', normal: '2.0 - 3.0 (Standard) / 3.0 - 4.5 (High Risk)' },
            { test: 'aPTT (Activ. Partial Thromboplastin)', normal: '30 - 40 sec (Tx: 1.5-2.5x control)' },
            { test: 'Fibrinogen', normal: '200 - 400 mg/dL' },
            { test: 'D-Dimer', normal: '< 250 ng/mL (or < 0.50 mcg/mL)' },
        ]
    },
    {
        category: 'Arterial Blood Gases (ABGs)',
        description: 'Respiratory Status',
        color: '#bbf7d0', // Light Green
        items: [
            { test: 'pH', normal: '7.35 - 7.45' },
            { test: 'PaCO2 (Partial Pressure CO2)', normal: '35 - 45 mmHg' },
            { test: 'HCO3 (Bicarbonate)', normal: '22 - 26 mEq/L' },
            { test: 'PaO2 (Partial Pressure O2)', normal: '80 - 100 mmHg' },
            { test: 'SaO2 (Oxygen Saturation)', normal: '> 95%' },
        ]
    },
    {
        category: 'Lipid Panel',
        description: 'Cholesterol',
        color: '#fbcfe8', // Light Pink
        items: [
            { test: 'Total Cholesterol', normal: '< 200 mg/dL' },
            { test: 'LDL ("Bad")', normal: '< 100 mg/dL' },
            { test: 'HDL ("Good")', normal: '> 40 (M) / > 50 (F) mg/dL' },
            { test: 'Triglycerides', normal: '< 150 mg/dL' },
        ]
    },
    {
        category: 'Liver Function',
        description: 'Hepatic Panel',
        color: '#fed7aa', // Light Orange
        items: [
            { test: 'ALT (Alanine Aminotransferase)', normal: '4 - 36 U/L' },
            { test: 'AST (Aspartate Aminotransferase)', normal: '0 - 35 U/L' },
            { test: 'ALP (Alkaline Phosphatase)', normal: '30 - 120 U/L' },
            { test: 'Bilirubin (Total)', normal: '0.3 - 1.0 mg/dL' },
            { test: 'Albumin', normal: '3.5 - 5.0 g/dL' },
            { test: 'Total Protein', normal: '6.4 - 8.3 g/dL' },
            { test: 'Ammonia', normal: '10 - 80 mcg/dL' },
        ]
    },
    {
        category: 'Cardiac Markers',
        description: 'Heart Health',
        color: '#e2e8f0', // Light Slate
        items: [
            { test: 'Troponin I', normal: '< 0.03 ng/mL' },
            { test: 'Troponin T', normal: '< 0.1 ng/mL' },
            { test: 'CK-MB', normal: '0 - 3 ng/mL (or 0-6% of total CK)' },
            { test: 'BNP (Brain Natriuretic Peptide)', normal: '< 100 pg/mL' },
        ]
    },
    {
        category: 'Therapeutic Drug Levels',
        description: 'NTI Drugs',
        color: '#ccfbf1', // Teal
        items: [
            { test: 'Digoxin', normal: '0.8 - 2.0 ng/mL' },
            { test: 'Lithium', normal: '0.6 - 1.2 mEq/L' },
            { test: 'Phenytoin (Dilantin)', normal: '10 - 20 mcg/mL' },
            { test: 'Theophylline', normal: '10 - 20 mcg/mL' },
            { test: 'Vancomycin (Trough)', normal: '10 - 20 mcg/mL' },
        ]
    },
    {
        category: 'Urinalysis',
        description: 'Urine Test',
        color: '#fef9c3', // Yellow
        items: [
            { test: 'Specific Gravity', normal: '1.005 - 1.030' },
            { test: 'pH', normal: '4.6 - 8.0' },
            { test: 'Protein', normal: '0 - 8 mg/dL' },
            { test: 'Glucose', normal: 'Negative' },
            { test: 'Ketones', normal: 'Negative' },
            { test: 'WBC / RBC', normal: '< 2-5' },
        ]
    }
];

export const ReferenceLabs: React.FC = () => {
    const [search, setSearch] = useState('');

    const getFilteredData = () => {
        if (!search.trim()) return LAB_DATA;

        const lowerSearch = search.toLowerCase();
        return LAB_DATA.map(cat => ({
            ...cat,
            items: cat.items.filter(item =>
                item.test.toLowerCase().includes(lowerSearch) ||
                item.normal.toLowerCase().includes(lowerSearch)
            )
        })).filter(cat => cat.items.length > 0);
    };

    const filteredData = getFilteredData();

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', maxHeight: '500px', background: '#ffffff' }}>
            {/* Search Bar */}
            <div className="labs-search" style={{ position: 'sticky', top: 0, zIndex: 20, background: '#fff', padding: '12px' }}>
                <div style={{ position: 'relative' }}>
                    <svg
                        width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"
                        style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }}
                    >
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    <input
                        type="text"
                        placeholder="Search labs (e.g. Potassium, INR)..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '8px 12px 8px 36px',
                            border: '1px solid #e2e8f0',
                            borderRadius: '6px',
                            fontSize: '14px',
                            outline: 'none',
                            transition: 'border-color 0.2s'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                        onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                    />
                </div>
            </div>

            {/* Labs Content */}
            <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '16px' }}>
                {filteredData.length > 0 ? (
                    filteredData.map((category, idx) => (
                        <div key={idx} style={{ marginBottom: '0' }}>
                            {/* Category Header */}
                            <div style={{
                                background: category.color,
                                padding: '8px 16px',
                                borderTop: idx !== 0 ? '1px solid #e2e8f0' : 'none',
                                borderBottom: '1px solid rgba(0,0,0,0.05)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <span style={{ fontWeight: 700, fontSize: '13px', color: '#334155' }}>
                                    {category.category}
                                </span>
                                <span style={{ fontSize: '11px', color: '#475569', opacity: 0.8 }}>
                                    {category.description}
                                </span>
                            </div>

                            {/* Items Table */}
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                                <tbody>
                                    {category.items.map((item, itemIdx) => (
                                        <tr key={itemIdx} style={{
                                            background: itemIdx % 2 === 0 ? '#fff' : '#f8fafc',
                                            borderBottom: '1px solid #f1f5f9'
                                        }}>
                                            <td style={{ padding: '8px 16px', color: '#1e293b', fontWeight: 500, width: '50%' }}>
                                                {item.test}
                                            </td>
                                            <td style={{ padding: '8px 16px', color: '#4b5563', fontFamily: '"JetBrains Mono", monospace', fontSize: '12px' }}>
                                                {item.normal}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ))
                ) : (
                    <div style={{ padding: '32px', textAlign: 'center', color: '#94a3b8', fontSize: '14px' }}>
                        No matching labs found.
                    </div>
                )}
            </div>
        </div>
    );
};

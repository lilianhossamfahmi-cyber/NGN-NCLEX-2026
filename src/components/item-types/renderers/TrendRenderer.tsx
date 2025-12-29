import React from 'react';
import { GenericRendererProps } from './types';
import { SATARenderer } from './SATARenderer';
import { SingleChoiceRenderer } from './SingleChoiceRenderer';

// PART 2: STAND-ALONE TREND ITEM – COMPLETE AUDIT & FIX
export const TrendRenderer: React.FC<GenericRendererProps> = (props) => {
    const { config } = props;

    const isSATA = config.questionFormat === 'sata' || !!config.selectCount;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* 1. Trend Data Display */}
            {config.trendImageUrl ? (
                <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                    <img
                        src={config.trendImageUrl}
                        alt="Clinical Trend Data"
                        style={{ width: '100%', maxHeight: '400px', objectFit: 'contain', display: 'block' }}
                    />
                </div>
            ) : config.trendTable ? (
                <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px', background: 'white' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                        <thead>
                            <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                                {config.trendTable.columns?.map((col: string, i: number) => (
                                    <th key={i} style={{ padding: '10px', textAlign: 'left', fontWeight: 600, color: '#475569' }}>{col}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {config.trendTable.rows?.map((row: any[], i: number) => (
                                <tr key={i} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                    {row.map((cell: any, j: number) => (
                                        <td key={j} style={{ padding: '10px', color: '#1e293b' }}>{cell}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : null}

            {/* 2. Divider */}
            {config.stem && <div style={{ height: '1px', background: '#e2e8f0' }}></div>}

            {/* 3. Question Interaction */}
            <div>
                {isSATA ? (
                    <SATARenderer {...props} />
                ) : (
                    <SingleChoiceRenderer {...props} />
                )}
            </div>
        </div>
    );
};

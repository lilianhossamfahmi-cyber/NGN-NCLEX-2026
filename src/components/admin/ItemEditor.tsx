import React, { useEffect, useState } from 'react';
import { MasterQuestionItem } from '../../types/master-schema';
import { getBankItems, saveItemToBank } from '../../services/itemStorage';
import { enrichItemWithQuality } from '../../utils/autoQuality';

interface ItemEditorProps {
    itemId: string;
    onBack: () => void;
}

export const ItemEditor: React.FC<ItemEditorProps> = ({ itemId, onBack }) => {
    const [json, setJson] = useState<string>('');

    useEffect(() => {
        (async () => {
            const bank = await getBankItems();
            const found = bank.find(i => String(i.id) === itemId);
            if (found) {
                setJson(JSON.stringify(found, null, 2));
            }
        })();
    }, [itemId]);

    const handleSave = async () => {
        try {
            const parsed = JSON.parse(json) as MasterQuestionItem;
            const enriched = enrichItemWithQuality(parsed);
            await saveItemToBank(enriched);
            onBack();
        } catch (e) {
            console.error('Invalid JSON', e);
        }
    };

    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold mb-4">Edit Item – {itemId}</h2>
            <textarea
                className="w-full h-96 p-2 font-mono border rounded mb-4"
                value={json}
                onChange={e => setJson(e.target.value)}
            />
            <div className="flex space-x-2">
                <button onClick={onBack} className="px-4 py-2 bg-gray-300 rounded">
                    Back
                </button>
                <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded">
                    Save & Publish
                </button>
            </div>
        </div>
    );
};

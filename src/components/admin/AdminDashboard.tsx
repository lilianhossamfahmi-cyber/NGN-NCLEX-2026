import { Play, Save, Settings, CheckCircle, Layers, Activity, Database, Sparkles, FileCheck } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
// import { Badge } from '../ui/badge';

import { getBankItems, saveBatchToBank } from '../../services/itemStorage';
import { ItemBankGrid } from './ItemBankGrid';
import { ItemEditor } from './ItemEditor';
import { CaseStudyGeneratorV2 } from '../../services/CaseStudyGeneratorV2';

interface AdminDashboardProps {
    onNavigate: (view: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
    const [stats, setStats] = useState({
        totalItems: 0,
        draftItems: 0,
        publishedItems: 0,
        itemsThisWeek: 0
    });
    // internal view for the admin panel (grid or edit)
    const [adminView, setAdminView] = useState<'grid' | 'edit'>('grid');
    const [editItemId, setEditItemId] = useState<string | null>(null);

    const handleEdit = (id: string) => {
        setEditItemId(id);
        setAdminView('edit');
    };

    const handleBackToGrid = () => {
        setAdminView('grid');
        setEditItemId(null);
    };

    const refreshStats = async () => {
        const res = await getBankItems({ limit: 100000 });
        const bank = res.items || [];
        const total = bank.length;
        const draft = bank.filter(i => ((i as any).metadata?.status ?? 'draft') === 'draft').length;
        const published = bank.filter(i => (i as any).metadata?.status === 'published').length;
        const now = new Date();
        const week = bank.filter(i => {
            const created = (i as any).metadata?.createdAt;
            return created && (now.getTime() - new Date(created).getTime()) / (1000 * 60 * 60 * 24) <= 7;
        }).length;
        setStats({ totalItems: total, draftItems: draft, publishedItems: published, itemsThisWeek: week });
    };

    useEffect(() => {
        refreshStats();
    }, []);

    const handleSeedCaseStudy = async () => {
        try {
            // We'll try to fetch the local file I just created
            const response = await fetch('/src/dataStore/critical_care_case_study.json');
            if (!response.ok) throw new Error("Failed to load local seed file");
            const item = await response.json();

            await saveBatchToBank([item]);
            alert("✅ Successfully 'pushed' Critical Care Case Study to Admin Bank!");
            refreshStats(); // Update UI
        } catch (e: any) {
            console.error("Seed failed:", e);
            alert("Error seeding case study: " + e.message + "\n\nNote: If you are on Vercel, this file may not be served as a static asset yet. Try importing manually from the JSON I created.");
        }
    };

    const handleGenerateCaseStudyV2 = async () => {
        const topic = prompt('Enter case study topic (e.g., "Septic Shock", "Acute PE", "DKA"):', 'Acute Asthma Exacerbation');
        if (!topic) return;

        try {
            const generator = new CaseStudyGeneratorV2();
            const promptText = await generator.preparePrompt(topic);

            // Copy prompt to clipboard
            await navigator.clipboard.writeText(promptText);

            alert(
                `✅ Golden Prompt V2 copied to clipboard!\n\n` +
                `Topic: ${topic}\n\n` +
                `Next steps:\n` +
                `1. Paste into ChatGPT, Claude, or Gemini\n` +
                `2. Get JSON response\n` +
                `3. Save as JSON file in src/dataStore/\n` +
                `4. Click 'Validate & Import' to add to Item Bank`
            );
        } catch (e: any) {
            console.error('Generate failed:', e);
            alert('Error preparing prompt: ' + e.message);
        }
    };

    const handleValidateAndImport = async () => {
        // Create file input
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';

        input.onchange = async (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (!file) return;

            try {
                const text = await file.text();
                const generator = new CaseStudyGeneratorV2();
                const caseStudy = generator.parseResponse(text);
                const validation = generator.validate(caseStudy);

                if (!validation.valid) {
                    const errorList = validation.errors.slice(0, 5).join('\n');
                    const more = validation.errors.length > 5 ? `\n... and ${validation.errors.length - 5} more` : '';
                    alert(`❌ Validation Failed (${validation.errors.length} errors):\n\n${errorList}${more}`);
                    return;
                }

                // Valid - add to bank
                await saveBatchToBank([caseStudy]);

                const warningNote = validation.warnings.length > 0
                    ? `\n\n⚠️ ${validation.warnings.length} warnings (see console)`
                    : '';

                alert(`✅ Case Study validated and imported successfully!${warningNote}`);
                if (validation.warnings.length > 0) {
                    console.log('Warnings:', validation.warnings);
                }
                refreshStats();
            } catch (e: any) {
                console.error('Import failed:', e);
                alert('Error importing: ' + e.message);
            }
        };

        input.click();
    };

    return (
        <div className="flex h-full flex-col space-y-8 p-8">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Item Bank Command</h2>
                    <p className="text-muted-foreground">Manage, validate, and publish NGN exam content.</p>
                </div>
                <div className="flex items-center space-x-2">
                    <Button variant="outline" onClick={() => onNavigate('settings')}>
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={handleGenerateCaseStudyV2}
                        style={{ backgroundColor: '#10b981', color: 'white' }}
                    >
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate V2
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={handleValidateAndImport}
                        style={{ backgroundColor: '#6366f1', color: 'white' }}
                    >
                        <FileCheck className="mr-2 h-4 w-4" />
                        Validate & Import
                    </Button>
                    <Button variant="secondary" onClick={handleSeedCaseStudy} style={{ backgroundColor: '#4f46e5', color: 'white' }}>
                        <Database className="mr-2 h-4 w-4" />
                        Push Case Study
                    </Button>
                    <Button onClick={() => onNavigate('batch')}>
                        <Play className="mr-2 h-4 w-4" />
                        New Batch
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Items</CardTitle>
                        <Layers className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalItems.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">+0 from last week</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Draft Queue</CardTitle>
                        <Save className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.draftItems.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Action Needed</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Published</CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.publishedItems.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Live in Student App</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Weekly Velocity</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+{stats.itemsThisWeek}</div>
                        <p className="text-xs text-muted-foreground">Target: 500/week</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="col-span-4">
                <CardHeader>
                    <CardTitle>Item Bank</CardTitle>
                </CardHeader>
                <CardContent>
                    {adminView === 'grid' && (
                        <ItemBankGrid onEdit={handleEdit} />
                    )}
                    {adminView === 'edit' && editItemId && (
                        <ItemEditor itemId={editItemId} onBack={handleBackToGrid} />
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

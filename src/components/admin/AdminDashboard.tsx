import { Play, Save, Settings, CheckCircle, Layers, Activity } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
// import { Badge } from '../ui/badge';

import { getBankItems } from '../../services/itemStorage';
import { ItemBankGrid } from './ItemBankGrid';
import { ItemEditor } from './ItemEditor';

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

    // Update stats whenever the bank changes
    useEffect(() => {
        (async () => {
            const res = await getBankItems({ limit: 100000 }); // Fetch all for accurate stats
            const bank = res.items || [];
            const total = bank.length;
            // Check metadata.status as source of truth
            const draft = bank.filter(i => ((i as any).metadata?.status ?? 'draft') === 'draft').length;
            const published = bank.filter(i => (i as any).metadata?.status === 'published').length;

            // Simple weekly calc: items created in last 7 days (assuming metadata.createdAt)
            const now = new Date();
            const week = bank.filter(i => {
                const created = (i as any).metadata?.createdAt;
                return created && (now.getTime() - new Date(created).getTime()) / (1000 * 60 * 60 * 24) <= 7;
            }).length;
            setStats({ totalItems: total, draftItems: draft, publishedItems: published, itemsThisWeek: week });
        })();
    }, []);

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

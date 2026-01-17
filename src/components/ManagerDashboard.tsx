'use client';

import { Users, Briefcase, CheckCircle, Clock, Target } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProjectProgress } from "@/components/ProjectProgress";
import { TeamSection } from "@/components/TeamSection";
import { CalendarWidget } from "@/components/CalendarWidget";

export const ManagerDashboard = () => {
    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Manager Dashboard</h1>
                    <p className="text-muted-foreground mt-1">Oversee teams and project operations</p>
                </div>
                <Users className="w-12 h-12 text-blue-500" />
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">18</div>
                        <p className="text-xs text-muted-foreground">
                            <span className="text-green-500">+2</span> started this week
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Team Members</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">42</div>
                        <p className="text-xs text-muted-foreground">Across 6 teams</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">156</div>
                        <p className="text-xs text-muted-foreground">
                            <span className="text-green-500">+32</span> this week
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">23</div>
                        <p className="text-xs text-muted-foreground">8 high priority</p>
                    </CardContent>
                </Card>
            </div>

            {/* Project Performance */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Project Performance</CardTitle>
                        <CardDescription>Overview of project completion rates</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium">Website Redesign</span>
                                    <span className="text-sm text-muted-foreground">85%</span>
                                </div>
                                <div className="w-full bg-secondary rounded-full h-2">
                                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium">Mobile App Development</span>
                                    <span className="text-sm text-muted-foreground">62%</span>
                                </div>
                                <div className="w-full bg-secondary rounded-full h-2">
                                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '62%' }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium">Marketing Campaign</span>
                                    <span className="text-sm text-muted-foreground">40%</span>
                                </div>
                                <div className="w-full bg-secondary rounded-full h-2">
                                    <div className="bg-orange-500 h-2 rounded-full" style={{ width: '40%' }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium">Backend Migration</span>
                                    <span className="text-sm text-muted-foreground">95%</span>
                                </div>
                                <div className="w-full bg-secondary rounded-full h-2">
                                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '95%' }}></div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Team Goals</CardTitle>
                        <CardDescription>Monthly objectives</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-start gap-3">
                            <Target className="w-5 h-5 text-green-500 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm font-medium">Complete 5 projects</p>
                                <p className="text-xs text-muted-foreground">3/5 completed</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Target className="w-5 h-5 text-blue-500 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm font-medium">Onboard 10 new members</p>
                                <p className="text-xs text-muted-foreground">7/10 completed</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Target className="w-5 h-5 text-orange-500 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm font-medium">Improve efficiency by 20%</p>
                                <p className="text-xs text-muted-foreground">12% achieved</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Team & Calendar */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <TeamSection />
                <CalendarWidget />
            </div>

            {/* Projects Overview */}
            <ProjectProgress />
        </div>
    );
}

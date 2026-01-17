'use client';

import { User, ListTodo, Clock, Award, Target, BookOpen } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarWidget } from "@/components/CalendarWidget";

export const EmployeeDashboard = () => {
    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Employee Dashboard</h1>
                    <p className="text-muted-foreground mt-1">Your personal workspace and tasks</p>
                </div>
                <User className="w-12 h-12 text-orange-500" />
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tasks Assigned</CardTitle>
                        <ListTodo className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12</div>
                        <p className="text-xs text-muted-foreground">
                            <span className="text-green-500">8 completed</span> this week
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Hours Logged</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">38.5h</div>
                        <p className="text-xs text-muted-foreground">This week</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Achievements</CardTitle>
                        <Award className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">7</div>
                        <p className="text-xs text-muted-foreground">Badges earned</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Leave Balance</CardTitle>
                        <Target className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">18</div>
                        <p className="text-xs text-muted-foreground">Days remaining</p>
                    </CardContent>
                </Card>
            </div>

            {/* Tasks & Training */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>My Tasks</CardTitle>
                        <CardDescription>Your current assignments</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                            <div className="w-2 h-2 rounded-full bg-red-500 mt-2"></div>
                            <div className="flex-1">
                                <p className="text-sm font-medium">Complete project documentation</p>
                                <p className="text-xs text-muted-foreground">Due: Today, 5:00 PM</p>
                            </div>
                            <span className="text-xs px-2 py-1 rounded-full bg-red-500/10 text-red-500">High</span>
                        </div>
                        <div className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                            <div className="w-2 h-2 rounded-full bg-orange-500 mt-2"></div>
                            <div className="flex-1">
                                <p className="text-sm font-medium">Review code changes</p>
                                <p className="text-xs text-muted-foreground">Due: Tomorrow</p>
                            </div>
                            <span className="text-xs px-2 py-1 rounded-full bg-orange-500/10 text-orange-500">Medium</span>
                        </div>
                        <div className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                            <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                            <div className="flex-1">
                                <p className="text-sm font-medium">Attend team meeting</p>
                                <p className="text-xs text-muted-foreground">Due: Jan 12</p>
                            </div>
                            <span className="text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-500">Low</span>
                        </div>
                        <div className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                            <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                            <div className="flex-1">
                                <p className="text-sm font-medium">Update project timeline</p>
                                <p className="text-xs text-muted-foreground">Due: Jan 15</p>
                            </div>
                            <span className="text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-500">Low</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Learning & Development</CardTitle>
                        <CardDescription>Your training progress</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <BookOpen className="w-4 h-4 text-blue-500" />
                                    <span className="text-sm font-medium">React Advanced Patterns</span>
                                </div>
                                <span className="text-sm text-muted-foreground">75%</span>
                            </div>
                            <div className="w-full bg-secondary rounded-full h-2">
                                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <BookOpen className="w-4 h-4 text-purple-500" />
                                    <span className="text-sm font-medium">TypeScript Mastery</span>
                                </div>
                                <span className="text-sm text-muted-foreground">45%</span>
                            </div>
                            <div className="w-full bg-secondary rounded-full h-2">
                                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <BookOpen className="w-4 h-4 text-green-500" />
                                    <span className="text-sm font-medium">Agile Methodology</span>
                                </div>
                                <span className="text-sm text-muted-foreground">100%</span>
                            </div>
                            <div className="w-full bg-secondary rounded-full h-2">
                                <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Performance & Calendar */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Achievements</CardTitle>
                        <CardDescription>Your latest milestones</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center">
                                <Award className="w-5 h-5 text-yellow-500" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium">Task Master</p>
                                <p className="text-xs text-muted-foreground">Completed 50 tasks</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                                <Award className="w-5 h-5 text-blue-500" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium">Team Player</p>
                                <p className="text-xs text-muted-foreground">Helped 10 colleagues</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                                <Award className="w-5 h-5 text-purple-500" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium">Fast Learner</p>
                                <p className="text-xs text-muted-foreground">3 courses completed</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="lg:col-span-2">
                    <CalendarWidget />
                </div>
            </div>
        </div>
    );
}

"use client";

import {
  CheckCircle,
  FileText,
  TrendingDown,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ResumeAnalysisV1 {
  analysis_summary: string;
}

interface ResumeAnalysisV2 {
  strengths: string[];
  weaknesses: string[];
}

interface ResumeAnalysisV3 {
  resume_analysis: string[];
}

interface ResumeAnalysis {
  resume_analysis_version: (1 | 2 | 3) | undefined | number;
  data: ResumeAnalysisV1 | ResumeAnalysisV2 | ResumeAnalysisV3;
}

interface ResumeAnalysisDisplayProps {
  resumeAnalysis: ResumeAnalysis | null;
}

export default function ResumeAnalysisDisplay({
  resumeAnalysis,
}: ResumeAnalysisDisplayProps) {
  if (!resumeAnalysis) {
    return (
      <Card className="border-none shadow-none">
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">
              No resume analysis available
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Version 1: Summary */}
      {resumeAnalysis.resume_analysis_version === 1 && (
        <Card className="border-none shadow-none">
          <CardContent className="p-0">
            <ScrollArea className="max-h-60">
              <p className="text-sm leading-relaxed">
                {(resumeAnalysis.data as ResumeAnalysisV1).analysis_summary}
              </p>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Version 2: Strengths and Weaknesses */}
      {resumeAnalysis.resume_analysis_version === 2 && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-none shadow-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Strengths
              </CardTitle>
            </CardHeader>
            <CardContent className="border-none shadow-none">
              <ScrollArea className="max-h-60">
                <ul className="space-y-2">
                  {(resumeAnalysis.data as ResumeAnalysisV2).strengths.map(
                    (strength, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                        <span className="text-sm">{strength}</span>
                      </li>
                    )
                  )}
                </ul>
              </ScrollArea>
            </CardContent>
          </Card>

          <Card className="border-none shadow-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5" />
                Weaknesses
              </CardTitle>
            </CardHeader>
            <CardContent className="">
              <ScrollArea className="h-60">
                <ul className="space-y-2">
                  {(resumeAnalysis.data as ResumeAnalysisV2).weaknesses.map(
                    (weakness, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <XCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                        <span className="text-sm">{weakness}</span>
                      </li>
                    )
                  )}
                </ul>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      )}

      {resumeAnalysis.resume_analysis_version === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Analysis Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="border-none shadow-none">
            <ScrollArea className="max-h-60">
              <ul className="space-y-2">
                {(resumeAnalysis.data as ResumeAnalysisV3).resume_analysis.map(
                  (analysis, index) => (
                    <li
                      key={index}
                      className="flex list-disc items-start gap-2"
                    >
                      <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                      <span className="text-sm">{analysis}</span>
                    </li>
                  )
                )}
              </ul>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Version 3: Comprehensive Analysis */}
    </div>
  );
}

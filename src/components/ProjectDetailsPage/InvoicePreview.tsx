"use client";

import { Phone, Mail, MapPin } from "lucide-react";
import { FirmSettings } from "@/types/firm-settings";
import { Project } from "@/types/project";
import { Client } from "@/types/client";
import { Milestone, RateType, MilestonePaymentStatus } from "@/types/milestone";

export interface InvoicePreviewData {
  firmSettings: FirmSettings;
  project: Project;
  client: Client | null;
  milestones: Milestone[];
  invoiceDate: string;
  notes?: string[];
}

interface MilestoneTableRow {
  phase: string;
  phaseName: string;
  scopeOfWork: string;
  rate: string;
  amount: number;
  totalAmount: number;
  paymentDate: string;
  totalPaid: number;
  isPending: boolean;
  isSubRow?: boolean;
}

function formatCurrency(amount: number): string {
  return `Rs.${amount.toLocaleString("en-IN")}`;
}

function formatRate(rateType: RateType, rate: number): string {
  switch (rateType) {
    case RateType.PER_SQFT:
      return `${rate} / SQFT`;
    case RateType.PER_VISIT:
      return `${rate}/ per visit`;
    case RateType.FIXED:
      return "Fixed";
    default:
      return `${rate}`;
  }
}

function formatDate(dateString?: string): string {
  if (!dateString) return "pending";
  const date = new Date(dateString);
  return `as on ${date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  })}`;
}

function formatInvoiceDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).toUpperCase().replace(",", "");
}

function buildTableRows(milestones: Milestone[]): MilestoneTableRow[] {
  const rows: MilestoneTableRow[] = [];

  // Sort milestones by stage number
  const sortedMilestones = [...milestones].sort((a, b) => a.stageNumber - b.stageNumber);

  sortedMilestones.forEach((milestone) => {
    // Build scope of work text from scope items
    const scopeTexts = milestone.scopeOfWork?.map(item => item.description) || [];
    const scopeOfWorkText = scopeTexts.join(", ");

    // Main milestone row
    const mainRate = milestone.scopeOfWork?.[0]?.rateType
      ? formatRate(milestone.scopeOfWork[0].rateType, milestone.scopeOfWork[0].rate)
      : "";

    rows.push({
      phase: `STAGE ${milestone.stageNumber}`,
      phaseName: milestone.title.toUpperCase(),
      scopeOfWork: scopeOfWorkText || milestone.description || "",
      rate: mainRate,
      amount: milestone.scopeAmount,
      totalAmount: milestone.scopeAmount,
      paymentDate: milestone.paymentStatus === MilestonePaymentStatus.PAID
        ? formatDate(milestone.lastPaymentDate)
        : "pending",
      totalPaid: milestone.paidAmount,
      isPending: milestone.paymentStatus !== MilestonePaymentStatus.PAID,
    });

    // Additional charges as sub-rows
    if (milestone.additionalCharges && milestone.additionalCharges.length > 0) {
      milestone.additionalCharges.forEach((charge) => {
        rows.push({
          phase: "",
          phaseName: "",
          scopeOfWork: charge.description,
          rate: `${charge.ratePerUnit}/ per visit`,
          amount: charge.amount,
          totalAmount: charge.amount,
          paymentDate: milestone.paymentStatus === MilestonePaymentStatus.PAID
            ? formatDate(milestone.lastPaymentDate)
            : "pending",
          totalPaid: 0,
          isPending: milestone.paymentStatus !== MilestonePaymentStatus.PAID,
          isSubRow: true,
        });
      });
    }
  });

  return rows;
}

export function InvoicePreview({ data }: { data: InvoicePreviewData }) {
  const { firmSettings, project, client, milestones, invoiceDate, notes } = data;

  const tableRows = buildTableRows(milestones);
  const grandTotal = milestones.reduce((sum, m) => sum + m.totalAmount, 0);
  const totalPaid = milestones.reduce((sum, m) => sum + m.paidAmount, 0);

  // Get client name
  const clientName = client?.name || project.client || "N/A";
  const builtUpArea = project.builtUpArea || 0;

  // Default notes if not provided
  const displayNotes = notes && notes.length > 0 ? notes : firmSettings.defaultNotes || [
    "Detailed MEP Drawings are considered an extra service.",
    "One site visit is included in each stage. Additional site visits will be charged separately.",
    "Site visits are for observation, reporting, and client coordination. They are not intended for full-time site supervision.",
  ];

  return (
    <div className="invoice-preview bg-white text-black print:bg-white" style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      <style jsx>{`
        @media print {
          .invoice-preview {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `}</style>

      {/* Top Blue Bar */}
      <div className="h-3 bg-[#1e3a5f]" />

      <div className="p-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          {/* Logo Section */}
          <div className="flex items-center gap-4">
            {firmSettings.logo ? (
              <img
                src={firmSettings.logo}
                alt={firmSettings.name}
                className="w-24 h-24 object-contain"
              />
            ) : (
              <div className="w-24 h-24 bg-gray-100 flex items-center justify-center rounded">
                <span className="text-3xl font-bold text-[#1e3a5f]">
                  {firmSettings.name.substring(0, 2).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* Contact Info */}
          <div className="text-right space-y-1 text-sm text-gray-700">
            <div className="flex items-center justify-end gap-2">
              <Phone className="w-4 h-4 text-[#1e3a5f]" />
              <span>{firmSettings.phone}{firmSettings.alternatePhone ? `, ${firmSettings.alternatePhone}` : ""}</span>
            </div>
            <div className="flex items-center justify-end gap-2">
              <Mail className="w-4 h-4 text-[#1e3a5f]" />
              <span>{firmSettings.email}</span>
            </div>
            <div className="flex items-center justify-end gap-2">
              <MapPin className="w-4 h-4 text-[#1e3a5f]" />
              <span>{firmSettings.address},</span>
            </div>
            <div className="text-right pl-6">{firmSettings.city}, {firmSettings.state}</div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-b-2 border-[#1e3a5f] mb-6" />

        {/* Project Info & Date Row */}
        <div className="flex justify-between items-start mb-6">
          <div className="space-y-1">
            <p className="text-sm">
              <span className="font-bold">Project: {project.name}</span>
              {project.location?.city && `, ${project.location.city}`}
            </p>
            <p className="text-sm">
              <span className="font-bold">Client:</span> {clientName}
            </p>
            <p className="text-sm">
              <span className="font-bold">Total Built-up Area: {builtUpArea.toLocaleString()} ~{Math.round(builtUpArea / 10) * 10} Sq.Ft</span>
            </p>
          </div>
          <div className="text-right">
            <p className="font-bold text-sm">{formatInvoiceDate(invoiceDate)}</p>
          </div>
        </div>

        {/* Milestone Table */}
        <div className="mb-6 overflow-x-auto">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr className="bg-[#1e3a5f] text-white">
                <th className="border border-gray-300 px-2 py-2 text-left font-semibold w-24">PHASES</th>
                <th className="border border-gray-300 px-2 py-2 text-left font-semibold">SCOPE OF WORK</th>
                <th className="border border-gray-300 px-2 py-2 text-center font-semibold w-24">RATE</th>
                <th className="border border-gray-300 px-2 py-2 text-right font-semibold w-20">AMOUNT</th>
                <th className="border border-gray-300 px-2 py-2 text-right font-semibold w-24">TOTAL AMOUNT</th>
                <th className="border border-gray-300 px-2 py-2 text-center font-semibold w-28">PAYMENT DATE</th>
                <th className="border border-gray-300 px-2 py-2 text-right font-semibold w-24">TOTAL PAID</th>
              </tr>
            </thead>
            <tbody>
              {tableRows.map((row, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="border border-gray-300 px-2 py-2 align-top">
                    {row.phase && (
                      <div>
                        <div className="font-semibold text-[#1e3a5f] text-[10px]">{row.phase}</div>
                        <div className="font-semibold text-[#1e3a5f] text-[10px]">{row.phaseName}</div>
                      </div>
                    )}
                  </td>
                  <td className="border border-gray-300 px-2 py-2 align-top text-[11px]">
                    {row.isSubRow ? (
                      <span className="italic">{row.scopeOfWork}</span>
                    ) : (
                      row.scopeOfWork
                    )}
                  </td>
                  <td className="border border-gray-300 px-2 py-2 text-center align-top text-[11px]">
                    {row.rate}
                  </td>
                  <td className="border border-gray-300 px-2 py-2 text-right align-top font-mono text-[11px]">
                    {row.amount > 0 ? formatCurrency(row.amount) : "NA"}
                  </td>
                  <td className="border border-gray-300 px-2 py-2 text-right align-top font-mono text-[11px]">
                    {row.totalAmount > 0 ? row.totalAmount.toLocaleString("en-IN") : ""}
                  </td>
                  <td className="border border-gray-300 px-2 py-2 text-center align-top text-[11px]">
                    {row.paymentDate}
                  </td>
                  <td className={`border border-gray-300 px-2 py-2 text-right align-top font-mono font-semibold text-[11px] ${row.isPending ? "text-red-600" : "text-green-600"}`}>
                    {row.isPending && !row.isSubRow ? "" : (row.totalPaid > 0 ? formatCurrency(row.totalPaid) : "")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Notes Section */}
        {displayNotes.length > 0 && (
          <div className="mt-6 p-4 bg-gray-50 rounded">
            <h3 className="font-bold text-sm mb-2">Notes:</h3>
            <ol className="list-decimal list-inside text-xs space-y-1 text-gray-700">
              {displayNotes.map((note, index) => (
                <li key={index}>{note}</li>
              ))}
            </ol>
          </div>
        )}
      </div>

      {/* Bottom Blue Bar */}
      <div className="h-3 bg-[#1e3a5f]" />
    </div>
  );
}

"use client";

import { Mail, MapPin, Phone } from "lucide-react";
import { FirmSettings } from "@/types/firm-settings";
import { Project } from "@/types/project";
import { Client } from "@/types/client";
import { InvoiceMilestoneItem } from "@/lib/api/invoicesApi";
import { getCloudFrontUrl } from "@/lib/utils/cloudfront";

export interface InvoicePreviewData {
  firmSettings: FirmSettings;
  project: Project;
  client: Client | null;
  milestoneItems: InvoiceMilestoneItem[];
  invoiceDate: string;
  invoiceRef?: string;
  notes?: string[];
  subtotal: number;
  discountType: "percentage" | "flat";
  discountValue: number;
  discountAmount: number;
  netTotal: number;
}

interface MilestoneTableRow {
  phase: string;
  phaseName: string;
  rateType: string;
  rate: string;
  quantity: number;
  amount: number;
}

function formatCurrency(amount: number): string {
  return `Rs.${amount.toLocaleString("en-IN")}`;
}

function formatRate(rateType: string, rate: number): string {
  switch (rateType) {
    case "per_sqft":
      return `${rate} / SQFT`;
    case "per_visit":
      return `${rate}/ per visit`;
    case "fixed":
      return "Fixed";
    default:
      return `${rate}`;
  }
}

function formatInvoiceDate(dateString: string): string {
  const date = new Date(dateString);
  return date
    .toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
    .toUpperCase()
    .replace(",", "");
}

function buildTableRows(
  milestoneItems: InvoiceMilestoneItem[]
): MilestoneTableRow[] {
  // Sort by stage number
  const sorted = [...milestoneItems].sort(
    (a, b) => a.milestoneStageNumber - b.milestoneStageNumber
  );

  return sorted.map((item) => ({
    phase: `STAGE ${item.milestoneStageNumber}`,
    phaseName: item.milestoneTitle.toUpperCase(),
    rateType: item.rateType,
    rate: formatRate(item.rateType, item.rate),
    quantity: item.quantity,
    amount: item.editableAmount,
  }));
}

export function InvoicePreview({ data }: { data: InvoicePreviewData }) {
  const {
    firmSettings,
    project,
    client,
    milestoneItems,
    invoiceDate,
    invoiceRef,
    notes,
    subtotal,
    discountType,
    discountValue,
    discountAmount,
    netTotal,
  } = data;

  const tableRows = buildTableRows(milestoneItems);

  // Get client name
  const clientName = client?.name || project.client || "N/A";
  const builtUpArea = project.builtUpArea || 0;

  // Default notes if not provided
  const displayNotes =
    notes && notes.length > 0
      ? notes
      : firmSettings.defaultNotes || [
          "Detailed MEP Drawings are considered an extra service.",
          "One site visit is included in each stage. Additional site visits will be charged separately.",
          "Site visits are for observation, reporting, and client coordination. They are not intended for full-time site supervision.",
        ];

  return (
    <div
      className="invoice-preview bg-white text-black print:bg-white"
      style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}
    >
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
            {firmSettings.logo || firmSettings.logoKey ? (
              <img
                src={
                  firmSettings.logo ||
                  getCloudFrontUrl(firmSettings.logoKey) ||
                  ""
                }
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
              <span>
                {firmSettings.phone}
                {firmSettings.alternatePhone
                  ? `, ${firmSettings.alternatePhone}`
                  : ""}
              </span>
            </div>
            <div className="flex items-center justify-end gap-2">
              <Mail className="w-4 h-4 text-[#1e3a5f]" />
              <span>{firmSettings.email}</span>
            </div>
            <div className="flex items-center justify-end gap-2">
              <MapPin className="w-4 h-4 text-[#1e3a5f]" />
              <span>{firmSettings.address},</span>
            </div>
            <div className="text-right pl-6">
              {firmSettings.city}, {firmSettings.state}
            </div>
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
              <span className="font-bold">
                Total Built-up Area: {builtUpArea.toLocaleString()} ~
                {Math.round(builtUpArea / 10) * 10} Sq.Ft
              </span>
            </p>
          </div>
          <div className="text-right space-y-1">
            {invoiceRef && (
              <p className="font-bold text-sm text-[#1e3a5f]">{invoiceRef}</p>
            )}
            <p className="font-bold text-sm">
              {formatInvoiceDate(invoiceDate)}
            </p>
          </div>
        </div>

        {/* Milestone Table */}
        <div className="mb-6 overflow-x-auto">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr className="bg-[#1e3a5f] text-white">
                <th className="border border-gray-300 px-2 py-2 text-left font-semibold w-24">
                  PHASES
                </th>
                <th className="border border-gray-300 px-2 py-2 text-left font-semibold">
                  SCOPE OF WORK
                </th>
                <th className="border border-gray-300 px-2 py-2 text-center font-semibold w-24">
                  RATE
                </th>
                <th className="border border-gray-300 px-2 py-2 text-center font-semibold w-20">
                  QTY
                </th>
                <th className="border border-gray-300 px-2 py-2 text-right font-semibold w-24">
                  AMOUNT
                </th>
              </tr>
            </thead>
            <tbody>
              {tableRows.map((row, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="border border-gray-300 px-2 py-2 align-top">
                    <div>
                      <div className="font-semibold text-[#1e3a5f] text-[10px]">
                        {row.phase}
                      </div>
                      <div className="font-semibold text-[#1e3a5f] text-[10px]">
                        {row.phaseName}
                      </div>
                    </div>
                  </td>
                  <td className="border border-gray-300 px-2 py-2 align-top text-[11px]">
                    {row.phaseName}
                  </td>
                  <td className="border border-gray-300 px-2 py-2 text-center align-top text-[11px]">
                    {row.rate}
                  </td>
                  <td className="border border-gray-300 px-2 py-2 text-center align-top text-[11px]">
                    {row.rateType !== "fixed" ? row.quantity : "-"}
                  </td>
                  <td className="border border-gray-300 px-2 py-2 text-right align-top font-mono text-[11px]">
                    {formatCurrency(row.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Financial Summary */}
        <div className="flex justify-end mb-6">
          <div className="w-72">
            <table className="w-full text-sm">
              <tbody>
                <tr>
                  <td className="py-1 text-gray-600">Subtotal</td>
                  <td className="py-1 text-right font-mono">
                    {formatCurrency(subtotal)}
                  </td>
                </tr>
                {discountAmount > 0 && (
                  <tr>
                    <td className="py-1 text-gray-600">
                      Discount
                      {discountType === "percentage"
                        ? ` (${discountValue}%)`
                        : ""}
                    </td>
                    <td className="py-1 text-right font-mono text-red-600">
                      -{formatCurrency(discountAmount)}
                    </td>
                  </tr>
                )}
                <tr className="border-t-2 border-[#1e3a5f]">
                  <td className="py-2 font-bold text-[#1e3a5f]">Net Total</td>
                  <td className="py-2 text-right font-mono font-bold text-[#1e3a5f]">
                    {formatCurrency(netTotal)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
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

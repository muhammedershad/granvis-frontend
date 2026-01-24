import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";

interface LeaveType {
  id: string;
  name: string;
  code: string;
  description: string;
  maxDays: number;
  isCarryForward: boolean;
  requiresApproval: boolean;
  requiresDocument: boolean;
  color: string;
  icon: string;
}

interface LeaveApplicationFormProps {
  onClose: () => void;
  leaveTypes: LeaveType[];
}

export function LeaveApplicationForm({
  onClose,
  leaveTypes,
}: LeaveApplicationFormProps) {
  const [formData, setFormData] = useState({
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
    isHalfDay: false,
    halfDaySession: "morning",
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelation: "",
    handoverNotes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.warn("Leave application submitted:", formData);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-gray-700 dark:text-white/70 font-medium">
            Leave Type *
          </Label>
          <Select
            value={formData.leaveType}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, leaveType: value }))
            }
          >
            <SelectTrigger
              className="
              bg-gradient-to-br from-white via-gray-50 to-blue-50 dark:from-gray-800/50 dark:via-gray-900/50 dark:to-gray-800/50
              border border-gray-200/60 dark:border-white/10
              text-gray-900 dark:text-white
              hover:bg-gradient-to-br hover:from-blue-50 hover:via-indigo-50 hover:to-purple-50
              dark:hover:from-gray-700/50 dark:hover:via-gray-800/50 dark:hover:to-gray-700/50
              shadow-sm hover:shadow-md transition-all duration-200
              backdrop-blur-sm"
            >
              <SelectValue placeholder="Select leave type" />
            </SelectTrigger>
            <SelectContent className="bg-white/95 dark:bg-gray-900/95 border border-gray-200/60 dark:border-white/10 backdrop-blur-xl">
              {leaveTypes.map((type) => (
                <SelectItem
                  key={type.id}
                  value={type.id}
                  className="text-gray-900 dark:text-white/90 hover:bg-gray-100 dark:hover:bg-white/10"
                >
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-gray-700 dark:text-white/70 font-medium">
            Half Day
          </Label>
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.isHalfDay}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    isHalfDay: e.target.checked,
                  }))
                }
                className="rounded border-gray-300 dark:border-white/30 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-gray-700 dark:text-white/70 text-sm">
                Half day leave
              </span>
            </label>
            {formData.isHalfDay && (
              <Select
                value={formData.halfDaySession}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, halfDaySession: value }))
                }
              >
                <SelectTrigger
                  className="
                  bg-gradient-to-br from-white via-gray-50 to-blue-50 dark:from-gray-800/50 dark:via-gray-900/50 dark:to-gray-800/50
                  border border-gray-200/60 dark:border-white/10
                  text-gray-900 dark:text-white w-32
                  shadow-sm backdrop-blur-sm"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white/95 dark:bg-gray-900/95 border border-gray-200/60 dark:border-white/10 backdrop-blur-xl">
                  <SelectItem
                    value="morning"
                    className="text-gray-900 dark:text-white/90 hover:bg-gray-100 dark:hover:bg-white/10"
                  >
                    Morning
                  </SelectItem>
                  <SelectItem
                    value="afternoon"
                    className="text-gray-900 dark:text-white/90 hover:bg-gray-100 dark:hover:bg-white/10"
                  >
                    Afternoon
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-gray-700 dark:text-white/70 font-medium">
            Start Date *
          </Label>
          <Input
            type="date"
            value={formData.startDate}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, startDate: e.target.value }))
            }
            className="
              bg-gradient-to-br from-white via-gray-50 to-blue-50 dark:from-gray-800/50 dark:via-gray-900/50 dark:to-gray-800/50
              border border-gray-200/60 dark:border-white/10
              text-gray-900 dark:text-white
              hover:bg-gradient-to-br hover:from-blue-50 hover:via-indigo-50 hover:to-purple-50
              dark:hover:from-gray-700/50 dark:hover:via-gray-800/50 dark:hover:to-gray-700/50
              shadow-sm hover:shadow-md transition-all duration-200
              backdrop-blur-sm"
            required
          />
        </div>

        <div className="space-y-2">
          <Label className="text-gray-700 dark:text-white/70 font-medium">
            End Date *
          </Label>
          <Input
            type="date"
            value={formData.endDate}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, endDate: e.target.value }))
            }
            className="
              bg-gradient-to-br from-white via-gray-50 to-blue-50 dark:from-gray-800/50 dark:via-gray-900/50 dark:to-gray-800/50
              border border-gray-200/60 dark:border-white/10
              text-gray-900 dark:text-white
              hover:bg-gradient-to-br hover:from-blue-50 hover:via-indigo-50 hover:to-purple-50
              dark:hover:from-gray-700/50 dark:hover:via-gray-800/50 dark:hover:to-gray-700/50
              shadow-sm hover:shadow-md transition-all duration-200
              backdrop-blur-sm"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-gray-700 dark:text-white/70 font-medium">
          Reason *
        </Label>
        <Textarea
          value={formData.reason}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, reason: e.target.value }))
          }
          placeholder="Please provide a reason for your leave..."
          className="
            bg-gradient-to-br from-white via-gray-50 to-blue-50 dark:from-gray-800/50 dark:via-gray-900/50 dark:to-gray-800/50
            border border-gray-200/60 dark:border-white/10
            text-gray-900 dark:text-white
            placeholder:text-gray-500 dark:placeholder:text-white/50
            hover:bg-gradient-to-br hover:from-blue-50 hover:via-indigo-50 hover:to-purple-50
            dark:hover:from-gray-700/50 dark:hover:via-gray-800/50 dark:hover:to-gray-700/50
            shadow-sm hover:shadow-md focus:shadow-lg transition-all duration-200
            backdrop-blur-sm min-h-[100px]"
          required
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-gray-900 dark:text-white/90 font-semibold">
          Emergency Contact
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="text-gray-700 dark:text-white/70 font-medium">
              Name
            </Label>
            <Input
              value={formData.emergencyContactName}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  emergencyContactName: e.target.value,
                }))
              }
              placeholder="Contact name"
              className="
                bg-gradient-to-br from-white via-gray-50 to-blue-50 dark:from-gray-800/50 dark:via-gray-900/50 dark:to-gray-800/50
                border border-gray-200/60 dark:border-white/10
                text-gray-900 dark:text-white
                placeholder:text-gray-500 dark:placeholder:text-white/50
                shadow-sm backdrop-blur-sm"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-gray-700 dark:text-white/70 font-medium">
              Phone
            </Label>
            <Input
              value={formData.emergencyContactPhone}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  emergencyContactPhone: e.target.value,
                }))
              }
              placeholder="Phone number"
              className="
                bg-gradient-to-br from-white via-gray-50 to-blue-50 dark:from-gray-800/50 dark:via-gray-900/50 dark:to-gray-800/50
                border border-gray-200/60 dark:border-white/10
                text-gray-900 dark:text-white
                placeholder:text-gray-500 dark:placeholder:text-white/50
                shadow-sm backdrop-blur-sm"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-gray-700 dark:text-white/70 font-medium">
              Relationship
            </Label>
            <Input
              value={formData.emergencyContactRelation}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  emergencyContactRelation: e.target.value,
                }))
              }
              placeholder="Relationship"
              className="
                bg-gradient-to-br from-white via-gray-50 to-blue-50 dark:from-gray-800/50 dark:via-gray-900/50 dark:to-gray-800/50
                border border-gray-200/60 dark:border-white/10
                text-gray-900 dark:text-white
                placeholder:text-gray-500 dark:placeholder:text-white/50
                shadow-sm backdrop-blur-sm"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-gray-700 dark:text-white/70 font-medium">
          Handover Notes
        </Label>
        <Textarea
          value={formData.handoverNotes}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, handoverNotes: e.target.value }))
          }
          placeholder="Any work handover notes or instructions..."
          className="
            bg-gradient-to-br from-white via-gray-50 to-blue-50 dark:from-gray-800/50 dark:via-gray-900/50 dark:to-gray-800/50
            border border-gray-200/60 dark:border-white/10
            text-gray-900 dark:text-white
            placeholder:text-gray-500 dark:placeholder:text-white/50
            hover:bg-gradient-to-br hover:from-blue-50 hover:via-indigo-50 hover:to-purple-50
            dark:hover:from-gray-700/50 dark:hover:via-gray-800/50 dark:hover:to-gray-700/50
            shadow-sm hover:shadow-md transition-all duration-200
            backdrop-blur-sm min-h-[80px]"
        />
      </div>

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="
            bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-800/50 dark:via-gray-900/50 dark:to-gray-800/50
            border border-gray-200/60 dark:border-white/10
            text-gray-700 dark:text-white/70
            hover:bg-gradient-to-br hover:from-gray-100 hover:via-gray-200/50 hover:to-gray-100
            dark:hover:from-gray-700/50 dark:hover:via-gray-800/50 dark:hover:to-gray-700/50
            shadow-sm hover:shadow-md transition-all duration-200
            backdrop-blur-sm"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200"
        >
          Submit Application
        </Button>
      </div>
    </form>
  );
}

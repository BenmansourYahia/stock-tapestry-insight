import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { getApiBase, setApiBase } from "@/lib/api";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Props { open: boolean; onOpenChange: (v: boolean) => void }

export const ApiBaseDialog = ({ open, onOpenChange }: Props) => {
  const [value, setValue] = useState("");
  useEffect(() => {
    if (open) setValue(getApiBase());
  }, [open]);

  const save = () => {
    setApiBase(value.trim());
    toast.success("API base updated");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>API Settings</DialogTitle>
          <DialogDescription>Set your backend base URL (e.g., https://api.yourdomain.com)</DialogDescription>
        </DialogHeader>
        <div className="grid gap-2">
          <Label htmlFor="api">Base URL</Label>
          <Input id="api" value={value} onChange={(e) => setValue(e.target.value)} placeholder="https://..." />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button variant="hero" onClick={save}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

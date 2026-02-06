import { Router } from "express";
import { z } from "zod";

type Donation = {
  id: string;
  amount: number;
  method: string;
  identifier?: string;
  name?: string;
  createdAt: string;
};

const router = Router();
const donations: Donation[] = [];

const donationSchema = z.object({
  amount: z.number().min(1),
  method: z.string().min(2),
  identifier: z.string().optional(),
  name: z.string().optional(),
});

router.get("/donations", (_req, res) => {
  return res.json(donations);
});

router.post("/donations", (req, res) => {
  const parsed = donationSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Dados inválidos", errors: parsed.error.flatten() });
  }

  const newDonation: Donation = {
    id: `don_${Date.now()}`,
    createdAt: new Date().toISOString(),
    ...parsed.data,
  };

  donations.unshift(newDonation);
  return res.status(201).json(newDonation);
});

export default router;
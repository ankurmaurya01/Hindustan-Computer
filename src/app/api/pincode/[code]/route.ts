import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { code: string } }) {
  const pin = params.code?.trim();

  if (!pin || pin.length !== 6 || !/^\d{6}$/.test(pin)) {
    return NextResponse.json({
      available: false,
      message: 'Please enter a valid 6-digit Indian PIN code',
    }, { status: 400 });
  }

  // Delivery estimation logic based on zone
  // Uttar Pradesh NCR / Metro zones (starts with 11, 12, 20, 40, 56, 60, 70)
  const firstTwo = pin.substring(0, 2);
  let days = 4;
  let zoneName = 'Standard Zone';
  let isExpressAvailable = true;

  if (['11', '12', '20'].includes(firstTwo)) {
    days = 2;
    zoneName = 'Uttar Pradesh NCR (Local Hub)';
  } else if (['40', '41', '56', '50', '60', '70', '38', '30'].includes(firstTwo)) {
    days = 3;
    zoneName = 'Tier-1 Metro Hub';
  } else if (['18', '19', '79'].includes(firstTwo)) {
    days = 6;
    zoneName = 'Special / Hill Region';
    isExpressAvailable = false;
  }

  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + days);

  const formattedDate = deliveryDate.toLocaleDateString('en-IN', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return NextResponse.json({
    available: true,
    pinCode: pin,
    zone: zoneName,
    estimatedDays: days,
    estimatedDate: formattedDate,
    codAvailable: true,
    expressAvailable: isExpressAvailable,
    courierPartners: ['Blue Dart Express', 'Uttar Pradeshvery Surface', 'DTDC Express'],
    message: `Delivery by ${formattedDate} to PIN ${pin}`,
  });
}

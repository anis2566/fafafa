import { db } from '@/lib/prisma';
import { MonthlyPayment, Student } from '@prisma/client';
import { Page, Text, View, Document, Image, renderToStream } from '@react-pdf/renderer';
import { format } from 'date-fns';
import { NextResponse } from 'next/server';

interface PaymentWithStudent extends MonthlyPayment {
    student: Student
}

interface Props {
    invoice: PaymentWithStudent
}

const Invoice = ({ invoice }: Props) => {
    return (
        <Document>
            <Page size="A4" style={{ border: "1px solid black", padding: "30px 20px" }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: "10px" }}>
                        <Image
                            src="https://utfs.io/f/e3e6625d-96dd-48c4-846a-10969b4fe0b1-1zbfv.png"
                            style={{ width: "40px", height: "40px", objectFit: "contain" }}
                        />
                        <View style={{ flexDirection: "column", gap: "2px" }}>
                            <Text style={{ fontWeight: "bold", fontSize: "20px" }}>Basic Education Care</Text>
                            <Text style={{ fontSize: "12px", width: "190px" }}>6/1 Abul Khairat Road, Armanitola, Dhaka-1100.</Text>
                            <Text style={{ fontSize: "12px" }}>02-57315570</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: "column", alignItems: "flex-end", gap: "2px" }}>
                        <Text style={{ fontSize: "20px" }}>Invoice</Text>
                        <View style={{flexDirection: "row", gap: "5px"}}>
                            <Text style={{fontSize: "12px"}}>Invoice #:</Text>
                            <Text style={{fontSize: "12px", textTransform: "uppercase"}}>{invoice.id.slice(-6)}</Text>
                        </View>
                        <Text style={{ fontSize: "12px" }}>Date: {format(invoice.createdAt, "dd MMM yyyy")}</Text>
                    </View>
                </View>

                <View style={{ margin: "30px 0" }}>
                    <View>
                        <Text>Bill To:</Text>
                        <View style={{ marginTop: "10px" }}>
                            <Text style={{ fontSize: "14px" }}>Anichur Rahman</Text>
                            <Text style={{ fontSize: "14px" }}>#120</Text>
                            <Text style={{ fontSize: "14px" }}>Four</Text>
                        </View>
                    </View>
                    <View style={{ marginTop: "20px" }}>
                        <Text>Bill Month:</Text>
                        <Text style={{ fontSize: "14px", marginTop: "5px" }}>August</Text>
                    </View>
                </View>

                <View>
                    <View style={{ backgroundColor: "#94a3b8", padding: "5px 20px", color: "white", flexDirection: "row", justifyContent: "space-between", alignItems: "center", fontSize: "14px" }}>
                        <Text>Month</Text>
                        <Text>Amount</Text>
                    </View>
                    <View style={{ padding: "10px 20px", flexDirection: "row", justifyContent: "space-between", alignItems: "center", fontSize: "14px", borderBottom: "1px solid gray" }}>
                        <Text>August</Text>
                        <Text>2000</Text>
                    </View>
                    <View style={{ backgroundColor: "#475569", padding: "5px 20px", color: "white", flexDirection: "row", justifyContent: "space-between", alignItems: "center", fontSize: "14px" }}>
                        <Text>Total</Text>
                        <Text>2000</Text>
                    </View>
                </View>

                <View style={{ margin: "30px 0" }}>
                    <Text style={{ textAlign: "center" }}>Thanks for your payment.</Text>
                    <Text style={{ textAlign: "center", fontSize: "12px" }}>[Note: Please preserve this invoice for further check.]</Text>
                </View>

                <View style={{ marginTop: "30px", alignItems: "flex-end" }}>
                    <View style={{ alignItems: "center" }}>
                        <Image
                            src="/signature.png"
                            style={{ height: "40px" }}
                        />
                        <Text style={{ fontSize: "14px" }}>Authrity Signature</Text>
                    </View>
                </View>
            </Page>
        </Document>
    )
}

export async function GET(request: Request, { params }: { params: { id: string; } }) {
    const invoice = await db.monthlyPayment.findUnique({
        where: {
            id: params.id
        },
        include: {
            student: true
        }
    })

    if (!invoice) {
        return new NextResponse('Invoice not found', { status: 404 });
    }

    const stream = await renderToStream(<Invoice invoice={invoice} />);
    return new NextResponse(stream as unknown as ReadableStream)
}
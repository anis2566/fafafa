import { MonthlyPayment, Student } from "@prisma/client"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Badge } from "@/components/ui/badge";

import { Actions } from "./action";
import { cn } from "@/lib/utils";

interface StudentWithProp extends Student {
    payments: MonthlyPayment[]
}

interface Props {
    students: StudentWithProp[]
}


export const StudentList = ({ students }: Props) => {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>#ID</TableHead>
                    <TableHead>Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>M. Phone</TableHead>
                    <TableHead>Due</TableHead>
                    <TableHead>Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    students.map(student => (
                        <TableRow key={student.id}>
                            <TableCell>{student.studentId}</TableCell>
                            <TableCell>
                                <Avatar>
                                    <AvatarImage src={student.imageUrl} />
                                    <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                            </TableCell>
                            <TableCell>{student.name}</TableCell>
                            <TableCell>{student.mPhone}</TableCell>
                            <TableCell>
                                <HoverCard>
                                    <HoverCardTrigger asChild>
                                        <Badge
                                            className={cn(
                                                "text-white",
                                                student.payments.length === 0 ? "bg-green-500" : "bg-rose-500",
                                            )}
                                        >
                                            {student.payments.length > 0 ? `${student.payments.length} Months` : "Paid"}
                                        </Badge>
                                    </HoverCardTrigger>
                                    <HoverCardContent className="w-60">
                                        <div className="grid grid-cols-2 gap-3">
                                            {
                                                student.payments.length > 0 && student.payments.map(payment => (
                                                    <Badge variant="destructive" key={payment.id} className="flex justify-center">{payment.month}</Badge>
                                                ))
                                            }
                                        </div>
                                    </HoverCardContent>
                                </HoverCard>
                            </TableCell>
                            <TableCell>
                                <Actions id={student.id} />
                            </TableCell>
                        </TableRow>
                    ))
                }
            </TableBody>
        </Table>
    )
}
import { notFound } from "next/navigation";
import { subjectById } from "@/lib/site";
import PracticeClient from "./PracticeClient";

export const dynamic = "force-dynamic";

export default function PracticeSubjectPage({ params }: { params: { subject: string } }) {
  const subject = subjectById(params.subject);
  if (!subject) notFound();
  return <PracticeClient subjectId={subject.id} subjectName={subject.name} domains={[...subject.domains]} />;
}

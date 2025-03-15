import { getFiles, getTotalSpaceUsed } from "@/lib/actions/file.actions";
import { convertFileSize, getUsageSummary } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { Separator } from "../../../components/ui/separator";
import FormattedDateTime from "../../../components/FormattedDateTime";
import { Chart } from "../../../components/Chart";
import Thumbnail from "../../../components/Thumbnail";
import { Models } from "node-appwrite";
import ActionDropdown from "../../../components/ActionDropdown";

export default async function Home() {
  const [files, totalSpace] = await Promise.all([
    getFiles({types: [], limit:8}),
    getTotalSpaceUsed(),
  ]);
  // Get usage summary
  const usageSummary = getUsageSummary(totalSpace);
  return (
  <div className="dashboard-container">
      <section>
        <Chart used={totalSpace.used} />

        {/* Uploaded file type summaries */}
        <ul className="dashboard-summary-list">
          {usageSummary.map((summary) => (
            <Link
              href={summary.url}
              key={summary.title}
              className="dashboard-summary-card"
            >
              <div className="space-y-4">
                <div className="flex justify-between gap-3">
                  <Image
                    src={summary.icon}
                    width={100}
                    height={100}
                    alt="uploaded image"
                    className="summary-type-icon"
                  />
                  <h4 className="summary-type-size">
                    {convertFileSize(summary.size) || 0}
                  </h4>
                </div>

                <h5 className="summary-type-title">{summary.title}</h5>
                <Separator className="bg-light-400" />
                <FormattedDateTime
                  date={summary.latestDate}
                  className="text-center"
                />
              </div>
            </Link>
          ))}
        </ul>
      </section>

      <section className="dashboard-recent-files">
        {/* Recent files uploaded */}
        <h2 className="text-xl font-semibold mb-4">Recent Files</h2>
        {files.total > 0 ? (
          <ul className="space-y-2">
            {files.documents.map((file: Models.Document, index: number) => (
              <li key={file.id || index} className="gap-2">
                <div  className='flex  gap-2 flex-col rounded-[18px] bg-white p-5 shadow-sm transition-all hover:shadow-drop-3 '>
                    <div className='flex flex-row justify-between '>
                        <Link href={file.url} className="flex flex-row justify-between gap-6 cursor-pointer">
                          <Thumbnail type={file.type} extension={file.extension} url={file.url}/>
                          <div className="flex flex-col gap-2">
                          <p className='recent-file-name'>{file.name}</p>
                          <FormattedDateTime date={file.$createdAt} className='body-2 text-light-200' />
                          </div>
                        </Link>
                        <ActionDropdown file={file}/>
                    </div>
                    
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="empty-list">Empty for now..</p>
        )}
      </section>

    </div>
  );
}

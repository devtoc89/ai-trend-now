"use server";

import Image from "next/image";
import Link from "next/link";
import NoImageSrc from "public/no_image.webp";
import type { PostListViewList } from "#layer/action/post.action";
import TimeAgo from "#layer/ui/components/common/(client)/TimeAgo/TimeAgo";
import Markdown from "#layer/ui/components/common/(server)/Markdown/Markdown";

function PostListPageList({ list, urlPath }: { list: PostListViewList[]; urlPath: string }) {
  return (
    <div className="h-full w-full flex gap-6 flex-col pb-10">
      {list.map((post) => (
        <Link
          key={post.id}
          href={`${urlPath}${post.id}`}
          className="border border-gray-200 rounded-md whitespace-pre-wrap w-full shadow-lg overflow-hidden dark:bg-slate-800 dark:border-gray-700 dark:text-white"
        >
          <div className="flex flex-col md:flex-row md:h-[12.5rem]">
            <div className="md:w-[13rem] flex justify-center items-center">
              <Image
                src={NoImageSrc}
                width={13 * 16}
                height={13 * 16}
                alt="related iamge"
                style={{ width: "100%", objectFit: "cover" }}
              />
            </div>
            <div className="flex-1  px-6  relative">
              <div className=" overflow-hidden ">
                <div className="flex flex-row items-baseline gap-4">
                  <div className="flex-1  pb-2 md:pb-0 flex flex-row gap-2">
                    <div className="flex-1">
                      <Markdown className="whitespace-nowrap">{post.title}</Markdown>
                    </div>
                  </div>
                  <div className="w-fit">
                    <TimeAgo>{post.createdAt}</TimeAgo>
                  </div>
                </div>
                <div className="pb-4 md:pb-0">
                  <Markdown className="whitespace-nowrap">{post.summary}</Markdown>
                </div>
              </div>
              <div
                className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-gray-50 dark:from-gray-900 to-transparent pointer-events-none  md:block hidden"
                aria-hidden="true"
              />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default PostListPageList;

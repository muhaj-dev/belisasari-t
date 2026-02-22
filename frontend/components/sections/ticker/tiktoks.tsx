import Image from "next/image";
import UnlockNow from "@/components/unlock-now";
import { useEnvironmentStore } from "@/components/context";
import { pumpfunSample } from "@/lib/constants";
import { TokenData } from "@/lib/types";
import { formatMarketcap, getTimeAgo } from "@/lib/utils";
import { Play } from "lucide-react";

export default function Tiktoks({
  symbol,
  tiktoks,
}: {
  symbol: string;
  tiktoks: any[];
}) {
  const { paid } = useEnvironmentStore((store) => store);
  return (
    <>
      <div className="flex justify-between sen my-12 items-center">
        <div className="flex flex-col w-full">
          <p className="text-xl md:text-2xl text-center mx-auto md:mx-0 md:text-start font-bold nouns tracking-widest text-iris-primary">
            Curated Tiktoks
          </p>
          <p className="text-xs md:text-sm text-center mx-auto md:mx-0 md:text-start lg:text-md text-muted-foreground font-semibold mb-6">
            All videos where ${symbol.toUpperCase()} was mentioned/talked about.
          </p>
          <div className="relative flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 ">
              {[...(tiktoks || [])]
                .sort((a, b) => {
                  const dateA = (a.tiktoks?.created_at ?? a.created_at) ? new Date(a.tiktoks?.created_at ?? a.created_at).getTime() : 0;
                  const dateB = (b.tiktoks?.created_at ?? b.created_at) ? new Date(b.tiktoks?.created_at ?? b.created_at).getTime() : 0;
                  return dateB - dateA;
                })
                .filter(video => {
                  const v = video.tiktoks ?? video;
                  return (v.views > 0 || v.comments > 0);
                })
                .slice(0, paid ? (tiktoks?.length ?? 0) : 4)
                .map((video, i) => {
                const v = video.tiktoks ?? video;
                return (
                  <div
                    onClick={() => window.open(v.url, "_blank")}
                    className="cursor-pointer relative w-[300px] h-[500px] rounded-xl border-[2px] border-secondary hover:border-muted-foreground transition duration-300 ease-in-out"
                    key={i}
                  >
                    <img
                      src={v.thumbnail}
                      alt="tiktok"
                      className="w-[300px] h-[496px] rounded-xl"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "/tiktok-placeholder.png";
                      }}
                    />
                    <div className=" absolute inset-0 flex flex-col justify-between p-4 text-white">
                      {/* Top Info (Posted Time and Author Info) */}
                      <div className="flex items-center space-x-3">
                        <img
                          src={"https://picsum.photos/300/50" + i}
                          alt={v.username}
                          className="w-10 h-10 rounded-full border border-white"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/solana.png";
                          }}
                        />
                        <div>
                          <p className="font-semibold">
                            {v.username == ""
                              ? "the.chill.guy"
                              : v.username}
                          </p>
                          <p className="text-sm text-gray-300">
                            {getTimeAgo(v.created_at)}
                          </p>
                        </div>
                      </div>

                      {/* Bottom Info (Description and Comments Count) */}
                      <div className="w-full flex">
                        <div className="flex-1" />
                        <div className="flex space-x-1 items-center justify-end bg-secondary p-3 rounded-md">
                          <Play size={16} className="mr-1" />
                          <p className="text-sm font-semibold">
                            {formatMarketcap(v.views)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              {/* <Image
                src={"https://picsum.photos/300/500"}
                width={300}
                height={500}
                alt="tiktok"
                className="rounded-xl border border-[2px] border-secondary hover:border-muted-foreground transition duration-300 ease-in-out"
              />
              <Image
                src={"https://picsum.photos/300/500"}
                width={300}
                height={500}
                alt="tiktok"
                className="rounded-xl border border-[2px] border-secondary hover:border-muted-foreground transition duration-300 ease-in-out"
              />
              <Image
                src={"https://picsum.photos/300/500"}
                width={300}
                height={500}
                alt="tiktok"
                className="rounded-xl border border-[2px] border-secondary hover:border-muted-foreground transition duration-300 ease-in-out"
              />
              <Image
                src={"https://picsum.photos/300/500"}
                width={300}
                height={500}
                alt="tiktok"
                className="rounded-xl border border-[2px] border-secondary hover:border-muted-foreground transition duration-300 ease-in-out"
              />
              {paid && (
                <>
                  <Image
                    src={"https://picsum.photos/300/500"}
                    width={300}
                    height={500}
                    alt="tiktok"
                    className="rounded-xl border border-[2px] border-secondary hover:border-muted-foreground transition duration-300 ease-in-out"
                  />
                  <Image
                    src={"https://picsum.photos/300/500"}
                    width={300}
                    height={500}
                    alt="tiktok"
                    className="rounded-xl border border-[2px] border-secondary hover:border-muted-foreground transition duration-300 ease-in-out"
                  />
                  <Image
                    src={"https://picsum.photos/300/500"}
                    width={300}
                    height={500}
                    alt="tiktok"
                    className="rounded-xl border border-[2px] border-secondary hover:border-muted-foreground transition duration-300 ease-in-out"
                  />
                </>
              )} */}
            </div>

            {!paid && (
              <>
                {/* Gradient overlay for first row */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black rounded-xl backdrop-blur-[2px]" />

                {/* Hide subsequent rows with solid overlay */}
                <div className="absolute top-[500px] left-0 right-0 bottom-0 bg-black/80 backdrop-blur-sm rounded-xl">
                  <div className="grid grid-cols-4 gap-2 invisible">
                    <Image
                      src={"https://picsum.photos/300/500"}
                      width={300}
                      height={500}
                      alt="tiktok"
                      className="rounded-xl"
                    />
                    <Image
                      src={"https://picsum.photos/300/500"}
                      width={300}
                      height={500}
                      alt="tiktok"
                      className="rounded-xl"
                    />
                    <Image
                      src={"https://picsum.photos/300/500"}
                      width={300}
                      height={500}
                      alt="tiktok"
                      className="rounded-xl"
                    />
                  </div>
                </div>

                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-secondary rounded-lg p-6">
                  <UnlockNow text="View all curated TikToks" />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

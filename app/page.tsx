import EventCard from "@/components/EventCard";
import ExploreBtn from "@/components/ExploreBtn";
import { IEvent } from "@/database";
import { getEvents } from "@/database/event.service";
import { cacheLife } from "next/cache";

const Page = async () => {
  "use cache";
  cacheLife("hours");

  const events = await getEvents();

  return (
    <section>
      <h1 className="text-center">
        The Hub For Every <br /> {"Event You Can't Miss"}
      </h1>

      <p className="text-center mt-5">
        Hackathons, Meetups, and Conferences, All in One Place
      </p>

      <ExploreBtn />

      <div className="mt-20 space-y-7">
        <h3>Featured Elements</h3>

        <ul className="events">
          {events &&
            events.length > 0 &&
            events.map((event: IEvent) => (
              <li key={event.slug} className="list-none">
                <EventCard {...event} />
              </li>
            ))}
        </ul>
      </div>
    </section>
  );
};

export default Page;

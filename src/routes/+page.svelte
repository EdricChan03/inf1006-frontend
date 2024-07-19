<script lang="ts">
  import { Popover } from 'bits-ui';
  import CircleGaugeIcon from 'lucide-svelte/icons/circle-gauge';
  import PieChartIcon from 'lucide-svelte/icons/pie-chart';
  import RefreshCwIcon from 'lucide-svelte/icons/refresh-cw';
  import VideoOffIcon from 'lucide-svelte/icons/video-off';
  import XIcon from 'lucide-svelte/icons/x';

  import { intlFormatDistance } from 'date-fns';

  import StatusChip from '$lib/components/status/StatusChipContent.svelte';

  import { prettifyDate } from '$lib/utils/date/format';
  import { flyAndScale } from '$lib/utils/transitions/fly-and-scale';

  import { getData } from '$lib/api/data';
  import { Status, statuses } from '$lib/data/status';
  import { activateSensors } from '$lib/api/modify';

  let date = $state(new Date());

  let intervalMs = $state(3 * 1000); // Every 3 seconds

  let status = $state(Status.Loading);

  const getStatusData = (status: Status) => statuses[status];

  const onActivateSensorsClick = () => {
    activateSensors()
      .then((d) => d.json())
      .then((t) => {
        console.log(t);
      })
      .catch((e) => {
        console.log('Could not activate sensors:', e);
      });
  };

  const formatRelative = (date: Date, currDate: Date = new Date()) =>
    intlFormatDistance(date, currDate);

  let currDate = $state(new Date());
  let lastUpdated = $derived(formatRelative(date, currDate));

  $effect(() => {
    const tick = setInterval(() => {
      currDate = new Date();
      console.log('tick');
    }, 1000);

    return () => clearInterval(tick);
  });

  $effect(() => {
    const result = setInterval(() => {
      date = new Date();
      getData()
        .then((j) => {
          status = Status.Online;
          console.log(j);
        })
        .catch((e) => {
          status = Status.Offline;
        });
    }, intervalMs);

    return () => clearInterval(result);
  });
</script>

<header class="bg-sky-300 p-3 flex justify-between">
  <h1 class="font-semibold text-xl">Watering Can</h1>
  <Popover.Root>
    <Popover.Trigger
      class="rounded border text-white px-2 flex items-center gap-2 transition-all focus:ring focus-visible:outline-none {getStatusData(
        status
      ).classes}"
      ><StatusChip {status} />
    </Popover.Trigger>
    <Popover.Content
      class="z-30 w-full max-w-[328px] rounded-xl border border-slate-300 bg-slate-100 shadow-md"
      transition={flyAndScale}
      sideOffset={8}
    >
      <header class="flex gap-2 items-center border-b border-slate-700 rounded-t-xl p-3 bg-white">
        <h3 class="text-lg font-bold mr-auto">Status</h3>
        <button
          class="flex gap-2 items-center hover:bg-indigo-200 active:bg-indigo-300 rounded border border-indigo-400 focus:ring focus-visible:outline-none focus:ring-indigo-500 transition-all p-2"
        >
          <RefreshCwIcon aria-hidden="true" />
          Refresh
        </button>
        <Popover.Close
          class="hover:bg-sky-200 active:bg-sky-300 rounded-full border border-sky-400 focus:ring focus-visible:outline-none focus:ring-sky-500 transition-all p-2"
        >
          <XIcon />
        </Popover.Close>
      </header>
      <main class="p-3 flex flex-col gap-2">
        <p class="text-sm">
          <em
            >Last updated at <time datetime={date.toISOString()}>{lastUpdated}</time>, refreshes
            every {intervalMs / 1000} seconds</em
          >
        </p>
      </main>
    </Popover.Content>
  </Popover.Root>
</header>

<main class="grid md:grid-cols-3 auto-cols-auto gap-6 m-6">
  <!-- Sensor data -->
  <section
    class="rounded bg-slate-200 p-3 flex flex-col gap-3 border border-slate-400 md:col-span-2"
  >
    <header class="flex justify-between">
      <div>
        <h2 class="text-2xl">Sensor data</h2>
        <p class="italic text-sm">
          Last updated at <time datetime={date.toISOString()}>{prettifyDate(date)}</time>
        </p>
      </div>
    </header>
    <div class="grid gap-3 md:grid-flow-col auto-cols-auto">
      <figure class="bg-white p-2 flex flex-col gap-2 rounded">
        <div class="flex place-content-center p-10 border border-black rounded">
          <PieChartIcon size={48} />
        </div>
        <figcaption class="text-lg">Temperature</figcaption>
      </figure>
      <figure class="bg-white p-2 flex flex-col gap-2 rounded">
        <div class="flex place-content-center p-10 border border-black rounded">
          <PieChartIcon size={48} />
        </div>
        <figcaption class="text-lg">Moisture</figcaption>
      </figure>
    </div>
  </section>
  <!-- Actions -->
  <section class="rounded bg-purple-200 p-3 flex flex-col gap-3 border border-purple-400">
    <header>
      <h2 class="text-2xl">Actions</h2>
    </header>
    <div class="grid gap-3">
      <button
        class="bg-blue-200 hover:bg-blue-300 active:bg-blue-400 rounded shadow border-2 border-blue-400 focus:ring focus-visible:outline-none focus:ring-blue-500 transition-all p-3 flex flex-col gap-2 place-content-center items-center"
        onclick={onActivateSensorsClick}><CircleGaugeIcon />Activate sensors</button
      >
    </div>
  </section>
  <!-- Camera feed -->
  <section
    class="rounded bg-lime-200 p-3 flex flex-col gap-3 border border-lime-400 md:col-span-full"
  >
    <figure class="flex flex-col gap-2 rounded">
      <figcaption class="text-2xl">Camera Feed</figcaption>
      <div class="flex place-content-center p-10 border border-black rounded">
        <VideoOffIcon size={48} />
      </div>
    </figure>
  </section>
</main>

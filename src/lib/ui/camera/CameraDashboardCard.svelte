<script lang="ts">
  import VideoOffIcon from 'lucide-svelte/icons/video-off';

  import { prettifyDate } from '$lib/utils/date/format';

  import type { CameraDashboardCardProps } from './camera-dashboard-card-types';

  let {
    cameraBase64Src,
    lastUpdated,
    formatDate = prettifyDate
  }: CameraDashboardCardProps = $props();
</script>

<section
  class="rounded bg-lime-200 p-3 flex flex-col gap-3 border border-lime-400 md:col-span-full"
>
  <figure class="flex flex-col gap-2 rounded">
    <figcaption class="text-2xl">
      Camera Feed
      <p class="italic text-sm">
        Last updated at <time datetime={lastUpdated.toISOString()}>{formatDate(lastUpdated)}</time>
      </p>
    </figcaption>
    <div
      class="flex flex-col gap-2 place-content-center items-center p-10 border border-black rounded"
    >
      {#if cameraBase64Src}
        <img src={cameraBase64Src} alt="Camera feed" loading="lazy" />
      {:else}
        <VideoOffIcon class="text-red-500" size={48} />
        <span class="text-red-500 font-semibold">(No source)</span>
      {/if}
    </div>
  </figure>
</section>

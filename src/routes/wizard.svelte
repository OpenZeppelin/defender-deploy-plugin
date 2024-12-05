<script lang="ts">
  import { initWizardPlugin } from "$lib/wizard";
  import { onMount } from "svelte";
  import Configure from "$lib/wizard/components/Configure.svelte";
  import ApprovalProcess from "$lib/wizard/components/ApprovalProcess.svelte";
  import Section from "$lib/wizard/components/Section.svelte";
  import Button from "$lib/wizard/components/Button.svelte";
  import Network from "$lib/wizard/components/Network.svelte";

  onMount(initWizardPlugin);


  function deploy(): void {
    throw new Error("Function not implemented.");
  }
</script>
<section class="flex flex-col gap-2 w-1/3 p-4">
  <Section isOpen label="Configuration">
    <Configure />
  </Section>
  <Section label="Network">
    <Network />
  </Section>
  <Section 
    label="Approval Process" 
  >
    <ApprovalProcess />
  </Section>
  <Button disabled label="Deploy" onClick={deploy} />
</section>


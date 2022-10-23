<script>
  import { onMount } from 'svelte'

  export let data
  export let form

  let entries = data.entries

  // Remove parameters for form re-submission if request was successful.
  if (form?.success) {
    onMount(() => {
      window.history.pushState({}, '', window.location.href.split('?')[0])
    })
  }
</script>

<form method="POST" action="?/send">
  {#if form?.success} <p class="success">Successfully sent message!</p> {/if}
  {#if form?.error} <p class="error">{form?.error.message ?? ''}</p> {/if}

  <p>Name</p>
  <input name="name" type="text" value={form?.name ?? ''} required>
  <p>Message</p>
  <input name="message" type="text" value={form?.message ?? ''} required>
  <br><br>
  <button>Send</button>
</form>

<br><hr>

{#each entries as entry, i}
  <h2>{entry.name}</h2>
  <p>{entry.message}</p>
{/each}

<style>
  .success {
    color: green;
  }

  .error {
    font-weight: 700;
    color: red;
  }
</style>
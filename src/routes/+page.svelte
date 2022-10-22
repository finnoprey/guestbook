<script>
  export let data
  export let form

  let entries = data.entries
</script>

<form method="POST" action="?/send">
  {#if form?.success} <p class="success">Successfully sent message!</p> {/if}
  {#if form?.missing_name} <p class="error">Please enter a name!</p> {/if}
	{#if form?.missing_message} <p class="error">Please enter a message!</p> {/if}

  <p>Name</p>
  <input name="name" type="text" value={form?.name ?? ''}>
  <p>Message</p>
  <input name="message" type="text" value={form?.message ?? ''}>
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
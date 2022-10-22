<script>
  export let form
</script>

<form method="POST" action="?/send">
  {#if form?.success} <p class="success">Successfully sent message!</p> {/if}
  {#if form?.missing_name} <p class="error">Please enter a name!</p> {/if}
	{#if form?.missing_message} <p class="error">Please enter a message!</p> {/if}

  <p>Text</p>
  <input name="text" type="text">
  <button>Send</button>
</form>

{#if form?.filterResult}
  <p>{form.filterResult.text}</p>
  <p>{form.filterResult.result}</p>
  <p>{form.filterResult.reasons}</p>
{/if}
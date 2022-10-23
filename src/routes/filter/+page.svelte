<script>
  export let form
</script>

<form method="POST">
  <p>Enter some text to be filtered!</p>
  <input name="text" type="text" required>
  <button>Send</button>
</form>

{#if form?.filterResult}
  <p>Input: {form.filterResult.text}</p>
  <p>Passed Filter: {form.filterResult.result}</p>
  {#if form?.filterResult.reasons}
    <p>Violations: {form.filterResult.reasons}</p>
  {/if}
{/if}
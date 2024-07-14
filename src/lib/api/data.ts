export const getData = async () => {
  return (
    await fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: ''
    })
  ).json();
};

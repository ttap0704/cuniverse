import { SERVER_NAME } from "../../../next-react-state-management/constants";

async function fetchGetApi(url: string) {
  const res = await fetch(`${SERVER_NAME}/api${url}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data: APIResponse = await res.json();
  if (data.message) {
    alert(data.message);
  }

  return data.data;
}

async function fetchPostApi(body: object, url: string) {
  const res = await fetch(`${SERVER_NAME}/api${url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ time: new Date().toISOString(), data: body }),
  });

  const data: APIResponse = await res.json();
  if (data.message) {
    alert(data.message);
  }

  return data.data;
}

async function fetchPutApi(body: object, url: string) {
  const res = await fetch(`${SERVER_NAME}/api${url}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ time: new Date().toISOString(), data: body }),
  });

  const data: APIResponse = await res.json();
  if (data.message) {
    alert(data.message);
  }

  return data.data;
}

async function fetchDeleteApi(url: string) {
  const res = await fetch(`${SERVER_NAME}/api${url}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data: APIResponse = await res.json();
  if (data.message) {
    alert(data.message);
  }

  return data.data;
}

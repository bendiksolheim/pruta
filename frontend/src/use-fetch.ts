import useSWR from "swr";

function useFetch<T>(
  url: string,
  loading: () => JSX.Element,
  err: () => JSX.Element,
  success: (data: T) => JSX.Element
): JSX.Element {
  const { data, error } = useSWR(url, (url) => {
    return fetch(url).then((res) => res.json());
  });

  if (error) return err();
  if (!data) return loading();
  return success(data);
}

export default useFetch;

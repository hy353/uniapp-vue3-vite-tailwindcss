import { RequestInterface } from "@/typings/request";
import { inject } from "vue";
export default function useHttpRepositories() {
  const $http: RequestInterface = inject("$http") as RequestInterface;
  return {
    $http,
  };
}

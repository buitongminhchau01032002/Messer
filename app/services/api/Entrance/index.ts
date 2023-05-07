import { HTTP_METHOD } from "services/axiosHelper";
import { Endpoint, generateEndpointVersionning } from "utils/api";
import { apiSlice } from "..";
import { LoginDTO } from "./types";

const MODULE_NAME = "entrance";

const endpoints: Record<"login" | "validateToken", Endpoint> = {
  login: {
    endpoint: `/${MODULE_NAME}/login`,
  },
  validateToken: {
    endpoint: `/${MODULE_NAME}/auth-token`,
  },
};

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<any, LoginDTO>({
      query: (account) => {
        return {
          url: generateEndpointVersionning(endpoints.login),
          method: HTTP_METHOD.PUT,
          data: account,
        };
      },
    }),
    validateToken: builder.query<any, any>({
      query: () => {
        return {
          url: generateEndpointVersionning(endpoints.validateToken),
          method: HTTP_METHOD.GET,
        };
      },
    }),
  }),
  overrideExisting: false,
});

export const { useLoginMutation, useValidateTokenQuery } = authApi;

/* eslint-disable @typescript-eslint/explicit-function-return-type */
import MyToken from './myToken';
import fetch from 'node-fetch';
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import {
    ClientBuilder,

    // Import middlewares
    type AuthMiddlewareOptions, // Required for auth
    type HttpMiddlewareOptions,
    PasswordAuthMiddlewareOptions,
    Client,
    AnonymousAuthMiddlewareOptions,
    RefreshAuthMiddlewareOptions,
} from '@commercetools/sdk-client-v2';

// eslint-disable-next-line no-undef
const CTP_PROJECT_KEY = `${process.env.CTP_PROJECT_KEY}`;
// eslint-disable-next-line no-undef
const CTP_CLIENT_SECRET = `${process.env.CTP_CLIENT_SECRET}`;
// eslint-disable-next-line no-undef
const CTP_CLIENT_ID = `${process.env.CTP_CLIENT_ID}`;
// eslint-disable-next-line no-undef
const CTP_AUTH_URL = `${process.env.CTP_AUTH_URL}`;
// eslint-disable-next-line no-undef
const CTP_API_URL = `${process.env.CTP_API_URL}`;
// eslint-disable-next-line no-undef
const CTP_SCOPES = [`${process.env.CTP_SCOPES}`];
const ANONYMOUS_ID = 'idAnonym1';

export const myToken = new MyToken();

// Configure authMiddlewareOptions
const authMiddlewareOptions: AuthMiddlewareOptions = {
    host: CTP_AUTH_URL,
    projectKey: CTP_PROJECT_KEY,
    credentials: {
        clientId: CTP_CLIENT_ID,
        clientSecret: CTP_CLIENT_SECRET,
    },
    scopes: CTP_SCOPES,
    fetch,
};

// Configure httpMiddlewareOptions
const httpMiddlewareOptions: HttpMiddlewareOptions = {
    host: CTP_API_URL,
    fetch,
};

const anonymousMiddlewareOptions: AnonymousAuthMiddlewareOptions = {
    host: CTP_AUTH_URL,
    projectKey: CTP_PROJECT_KEY,
    credentials: {
        clientId: CTP_CLIENT_ID,
        clientSecret: CTP_CLIENT_SECRET,
        anonymousId: ANONYMOUS_ID,
    },
    scopes: CTP_SCOPES,
    fetch,
};

function getPasswordFlowOptions(username: string, password: string) {
    const options: PasswordAuthMiddlewareOptions = {
        host: CTP_AUTH_URL,
        projectKey: CTP_PROJECT_KEY,
        credentials: {
            clientId: CTP_CLIENT_ID,
            clientSecret: CTP_CLIENT_SECRET,
            user: {
                username: username,
                password: password,
            },
        },
        tokenCache: myToken,
        scopes: CTP_SCOPES,
        fetch,
    };
    return options;
}
export const getCredentialFlowClient = (): Client => {
    const ctpClient = new ClientBuilder()
        .withProjectKey(CTP_PROJECT_KEY)
        .withClientCredentialsFlow(authMiddlewareOptions)
        .withHttpMiddleware(httpMiddlewareOptions)
        .withLoggerMiddleware()
        .build();

    return ctpClient;
};

export const getAnonymousFlowClient = (): Client => {
    const ctpClient = new ClientBuilder()
        .withProjectKey(CTP_PROJECT_KEY)
        .withAnonymousSessionFlow(anonymousMiddlewareOptions)
        .withHttpMiddleware(httpMiddlewareOptions)
        .build();

    return ctpClient;
};

export const getPasswordFlowClient = (username: string, password: string): Client => {
    const ctpClient = new ClientBuilder()
        .withProjectKey(CTP_PROJECT_KEY)
        .withClientCredentialsFlow(authMiddlewareOptions)
        .withPasswordFlow(getPasswordFlowOptions(username, password))
        .withHttpMiddleware(httpMiddlewareOptions)
        .withLoggerMiddleware() // Include middleware for logging
        .build();

    return ctpClient;
};

export const getApiRootForCredentialFlow = () => {
    const apiRootForAnonumousFlow = createApiBuilderFromCtpClient(getCredentialFlowClient()).withProjectKey({
        projectKey: CTP_PROJECT_KEY,
    });

    return apiRootForAnonumousFlow;
};

export const getApiRootForAnonymousFlow = () => {
    const apiRootForAnonumousFlow = createApiBuilderFromCtpClient(getAnonymousFlowClient()).withProjectKey({
        projectKey: CTP_PROJECT_KEY,
    });

    return apiRootForAnonumousFlow;
};

export const getApiRootForPasswordFlow = (username: string, password: string) => {
    const apiRootForPasswordFlow = createApiBuilderFromCtpClient(
        getPasswordFlowClient(username, password)
    ).withProjectKey({
        projectKey: CTP_PROJECT_KEY,
    });

    return apiRootForPasswordFlow;
};

type ExistingTokenMiddlewareOptions = {
    force?: boolean;
};

export const getExistingTokenFlowClient = (): Client => {
    const authorization = `Bearer ${localStorage.getItem('token')}`;

    const options: ExistingTokenMiddlewareOptions = {
        force: true,
    };
    const ctpClient = new ClientBuilder()
        .withProjectKey(CTP_PROJECT_KEY)
        .withHttpMiddleware(httpMiddlewareOptions)
        .withExistingTokenFlow(authorization, options)
        .build();

    return ctpClient;
};

export const getAPIRootWithExistingTokenFlow = () => {
    const apiRootWithExistingTokenFlow = createApiBuilderFromCtpClient(getExistingTokenFlowClient()).withProjectKey({
        projectKey: CTP_PROJECT_KEY,
    });
    return apiRootWithExistingTokenFlow;
};

export const getApiRefreshTokenRoot = () => {
    const refreshOptions: RefreshAuthMiddlewareOptions = {
        ...authMiddlewareOptions,
        refreshToken: myToken.get().token,
    };
    const ctpClient = new ClientBuilder()
        .withProjectKey(CTP_PROJECT_KEY)
        .withHttpMiddleware(httpMiddlewareOptions)
        .withRefreshTokenFlow(refreshOptions)
        .withLoggerMiddleware()
        .build();

    return ctpClient;
};

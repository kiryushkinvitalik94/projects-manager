interface Api {
  get: (path: string) => void;
}

export default class ApiBuilder implements Api {
  private cache: Map<string, any> = new Map();
  private static instance: ApiBuilder | null = null;

  static getInstance(): ApiBuilder {
    if (!ApiBuilder.instance) {
      ApiBuilder.instance = new ApiBuilder();
    }
    return ApiBuilder.instance;
  }

  public clearCache(path: string): void {
    const desiredPath = path.match(/(\/api\/\w+)/)[0];

    for (const key of this.cache.keys()) {
      console.log(key, "key", desiredPath, key.includes(desiredPath));
      if (key.includes(desiredPath)) {
        this.cache.delete(key);
      }
    }
  }

  public get<ReturnData>(path) {
    return async (token: string = "", id?: number): Promise<ReturnData> => {
      const requestPath = `${path}${id ? `/${id}` : ""}`;

      if (this.cache.has(requestPath)) {
        return this.cache.get(requestPath);
      }

      try {
        const response = await fetch(requestPath, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          const error = await response.text();
          throw new Error(JSON.parse(error).message);
        }
        const json = await response.json();
        this.cache.set(requestPath, json);
        return json;
      } catch (error) {
        throw new Error(`Error fetching data: ${error}`);
      }
    };
  }
  public post<requestDataType, ReturnData>(path) {
    return async (
      requestData: requestDataType,
      token: string = ""
    ): Promise<ReturnData> => {
      try {
        const response = await fetch(path, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestData),
          method: "POST",
        });

        if (!response.ok) {
          const error = await response.text();
          throw new Error(JSON.parse(error).message);
        }

        this.clearCache(path);

        const data = await response.json();
        return data;
      } catch (error) {
        throw new Error(error);
      }
    };
  }
  public delete<requestDataType, ReturnData>(path) {
    return async (
      requestData: requestDataType,
      token: string = "",
      id: number
    ): Promise<ReturnData> => {
      const requestPath = `${path}${id ? `/${id}` : ""}`;
      try {
        const response = await fetch(requestPath, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestData),
        });

        if (!response.ok) {
          const error = await response.text();
          throw new Error(JSON.parse(error).message);
        }

        this.clearCache(requestPath);

        const data = await response.json();
        return data;
      } catch (error) {
        throw new Error(error);
      }
    };
  }
  public put<requestDataType, ReturnData>(path) {
    return async (
      requestData: requestDataType,
      token: string = "",
      id: number
    ): Promise<ReturnData> => {
      try {
        const requestPath = `${path}${id ? `/${id}` : ""}`;
        const response = await fetch(requestPath, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestData),
        });

        if (!response.ok) {
          const error = await response.text();
          throw new Error(JSON.parse(error).message);
        }

        this.clearCache(requestPath);

        const data = await response.json();
        return data;
      } catch (error) {
        throw new Error(error);
      }
    };
  }
}

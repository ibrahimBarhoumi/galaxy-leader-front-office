export interface QueryBuilder {
  toQueryMap: () => Map<string, string>;
  toQueryString: () => string;
}

export class QueryOptions implements QueryBuilder {


  constructor(private page: number, private size: number) {
    this.page = page;
    this.size = size;
  }

  toQueryMap() {
    const queryMap = new Map<string, string>();
    queryMap.set('page', `${this.page}`);
    queryMap.set('size', `${this.size}`);

    return queryMap;
  }

  toQueryString() {
    let queryString = '';
    this.toQueryMap().forEach((value: string, key: string) => {
      queryString = queryString.concat(`${key}=${value}&`);
    });

    return queryString.substring(0, queryString.length - 1);
  }
}

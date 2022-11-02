export const channelZones = [
  {
    value: "N",
    label: "N"
  },
  {
    value: "S",
    label: "S"
  },
  {
    value: "M",
    label: "M"
  }
];

export const purchaseOrigin = [
  {
    value: "CHIP",
    label: "Chips"
  },
  {
    value: "PORTABILIDAD",
    label: "Portabilidades"
  }
];

export const getUserId = () => {
  const user = window.sessionStorage.getItem("user");
  const userDecode = JSON.parse(window.atob(user));
  return userDecode.userId;
};

export const generateGetParams = (
  limit,
  offset,
  search,
  deliveryDate,
  georutaId
) => {
  let queryParams = "";
  if (search) {
    queryParams = `?s=${search}`;
  }
  if (limit) {
    if (queryParams) {
      queryParams = `${queryParams}&limit=${limit}`;
    } else {
      queryParams = `?limit=${limit}`;
    }
  }
  if (offset) {
    if (queryParams) {
      queryParams = `${queryParams}&offset=${offset}`;
    } else {
      queryParams = `?offset=${offset}`;
    }
  }
  if (deliveryDate) {
    if (queryParams) {
      queryParams = `${queryParams}&deliveryDate=${deliveryDate}`;
    } else {
      queryParams = `?deliveryDate=${deliveryDate}`;
    }
  }
  if (georutaId) {
    if (queryParams) {
      queryParams = `${queryParams}&georutaId=${georutaId}`;
    } else {
      queryParams = `?georutaId=${georutaId}`;
    }
  }
  return queryParams;
};

export const generateGetParamsGeoruta = (limit, offset, search, date) => {
  let queryParams = "";
  if (search) {
    queryParams = `?s=${search}`;
  }
  if (limit) {
    if (queryParams) {
      queryParams = `${queryParams}&limit=${limit}`;
    } else {
      queryParams = `?limit=${limit}`;
    }
  }
  if (offset) {
    if (queryParams) {
      queryParams = `${queryParams}&offset=${offset}`;
    } else {
      queryParams = `?offset=${offset}`;
    }
  }
  if (date) {
    if (queryParams) {
      queryParams = `${queryParams}&fecha=${date}`;
    } else {
      queryParams = `?fecha=${date}`;
    }
  }
  return queryParams;
};

export const formatToSelectOption = (items, value, name) => {
  return items.map(item => {
    return {
      ...item,
      label: item[name],
      value: item[value]
    };
  });
};

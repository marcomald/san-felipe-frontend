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
]

export const purchaseOrigin = [
    {
        value: "Chips",
        label: "chip"
    },
    {
        value: "Portabilidades",
        label: "portabilidad"
    }
]

export const getUserId = () => {
    const user = window.sessionStorage.getItem("user")
    const userDecode = JSON.parse(window.atob(user));
    return userDecode.userId
}
export interface User{
    id: string,
    name: string,
    email: string
}

export interface Card{
    id: string,
    title: string,
    description: string,
    position: number,
    column_id: string
}

export interface Column{
    id: string,
    title: string,
    position: number,
    board_id: string,
    cards: Card[]
}

export interface Board{
    id: string,
    name: string,
    owner_id: string,
    columns : Column[]
}
import RoundCard from "../models/roundCard.model"

const findMaxVoteCards = (array: Array<RoundCard>): Array<RoundCard> => {
    const votesArray = array.map((card: RoundCard) => card.votes);
    const maxVotes = Math.max(...votesArray);
    return array.filter((card: RoundCard) => card.votes === maxVotes)
}

export {
    findMaxVoteCards
};
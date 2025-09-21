import styled from "styled-components";

export const NodeContainer = styled.div`
  display: flex;
  justify-content: center;
`;

export const TopLevelNode = styled.div`
  display: flex;
  background: #c0c0c0;
  padding: 5px;
  border-radius: 2px;
  font-size: 18px;
`;

export const BranchNode = styled.div`
  display: flex;
  background: #980104;
  padding: 5px;
  border-radius: 2px;
  color: #fff;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 80px;
`;

export const LevelTwoNode = styled.div`
  display: flex;
  background: #007ad0;
  padding: 5px;
  border-radius: 2px;
  color: #fff;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 81px;
`;

export const LevelThreeNode = styled.div`
  display: flex;
  background: #359154;
  padding: 5px;
  border-radius: 2px;
  color: #fff;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 81px;
`;

export const LevelFourNode = styled.div`
  display: flex;
  background: #d4932b;
  padding: 5px;
  border-radius: 2px;
  color: #fff;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 81px;
`;
export const LevelFiveNode = styled.div`
  display: flex;
  background: #9f6078;
  padding: 5px;
  border-radius: 2px;
  color: #fff;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 81px;
`;
export const LevelSixNode = styled.div`
  display: flex;
  background: #557054;
  padding: 5px;
  border-radius: 2px;
  color: #fff;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 81px;
`;

export const UserImage = styled.img`
  width: 45px;
  height: 46px;
  border-radius: 50%;
`;

export const UserInfo = styled.div`
  height: 50px;
  overflow-wrap: break-word;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  .user-name {
    font-size: 13px;
  }
  .user-designation {
    font-size: 10px;
  }
`;

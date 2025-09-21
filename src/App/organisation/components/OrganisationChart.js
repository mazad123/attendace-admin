import React, { useEffect, useState } from "react";
import { Tree, TreeNode } from "react-organizational-chart";
import {
  NodeContainer,
  TopLevelNode,
  BranchNode,
  UserImage,
  UserInfo,
  LevelTwoNode,
  LevelThreeNode,
  LevelFourNode,
  LevelFiveNode,
  LevelSixNode,
} from "./OrganizationChart.styles";
import BlankProfileImage from "../../../assets/images/black-profile-image.jpg";
import { Popover, OverlayTrigger } from "react-bootstrap";

function OrganisationChart({ data }) {
  const [nodesTree, setNodesTree] = useState([]);

  useEffect(() => {
    let allData = [...data.org_data];
    let solvedTreeData = solveNodesData(allData);
    setNodesTree(solvedTreeData);
  }, [data]);

  const solveNodesData = (allData) => {
    const sortedNodes = { ...allData[0], level: 0 };
    const Level1Array = [];
    for (let node of allData[0].children) {
      let level2Node = {};
      const findL2Children = getChildren(node.id);
      level2Node = { ...node, children: findL2Children, level: 1 };
      if (level2Node.children && level2Node.children.length) {
        for (let L3Child of level2Node.children) {
          const nodeIndex = level2Node.children.findIndex(
            (l3) => l3.id === L3Child.id
          );
          let level3Node = {};
          const findL3Children = getChildren(L3Child.id);
          level3Node = { ...L3Child, children: findL3Children, level: 2 };
          if (level3Node.children && level3Node.children.length) {
            for (let L4Child of level3Node.children) {
              const node4Index = level3Node.children.findIndex(
                (l4) => l4.id === L4Child.id);
              let level4Node = {};
              const findL4Children = getChildren(L4Child.id);
               level4Node = { ...L4Child, children: findL4Children, level: 3 };
              if (level4Node.children && level4Node.children.length) {
                if (level4Node.children && level4Node.children.length) {
                  for (let L5Child of level4Node.children) {
                    const node5Index = level4Node.children.findIndex(
                      (l5) => l5.id === L5Child.id
               );
               let level5Node = {};
               const findL5Children = getChildren(L5Child.id);
               level5Node = { ...L5Child, children: findL5Children, level: 4 };
               if (level5Node.children && level5Node.children.length) {
                for (let L6Child of level5Node.children) {
                  const node6Index = level5Node.children.findIndex(
                    (l6) => l6.id === L6Child.id
             );

             let level6Node = {};
              const findL6Children = getChildren(L6Child.id);
              if (findL6Children) {
                 findL6Children.map((ch) => (ch.level = 6));
               }
               level6Node = { ...L6Child, children: findL6Children, level: 5 };
               level5Node.children[node6Index] = level6Node;
            }
          }
          level5Node = { ...L5Child, children: findL5Children, level: 4 };
          level4Node.children[node5Index] = level5Node;
        }
      }
    }
            level4Node = { ...L4Child, children: findL4Children, level: 3};
            level3Node.children[node4Index] =level4Node;
          }
        }
        
        level2Node.children[nodeIndex] = level3Node;
      }
    }
    Level1Array.push(level2Node);
  }
  // console.log({ final: { ...sortedNodes, children: Level1Array } });
  return { ...sortedNodes, children: Level1Array };
};

  const getChildren = (nodeId) => {
    const findChild = data.org_data.find((node) => node.parent && node.parent.id === nodeId);
    return findChild ? findChild.children : null;
  };


  const getChildNodes = (nodeData) => {
    if (nodeData) {
      return nodeData.map((node, i) => {
        return (
          <TreeNode
            label={
              <NodeContainer>
                {node.level === 2 && (
                  <OverlayTrigger
                    placement="bottom"
                    trigger="click"
                    rootClose
                    overlay={
                      <Popover>
                        <Popover.Content>
                          <div className="user-details-overlay">
                            <div>
                              <img
                                className="user-image"
                                src={
                                  node.profile_image
                                    ? node.profile_image
                                    : BlankProfileImage
                                }
                              />
                            </div>
                            <div>
                              <h4>{node.name}</h4>
                            </div>
                            <div>
                              <span>{node.designation}</span>
                            </div>
                          </div>
                        </Popover.Content>
                      </Popover>
                    }
                  >
                    <LevelTwoNode>
                      <UserImage
                        src={
                          node.profile_image
                            ? node.profile_image
                            : BlankProfileImage
                        }
                      />
                      <UserInfo>
                        <span className="user-name">{node.name}</span>
                        {/* <span className="user-designation">
                        {node.designation}
                      </span> */}
                      </UserInfo>
                    </LevelTwoNode>
                  </OverlayTrigger>
                )}
                {node.level === 3 && (
                  <OverlayTrigger
                    placement="bottom"
                    trigger="click"
                    rootClose
                    overlay={
                      <Popover>
                        <Popover.Content>
                          <div className="user-details-overlay">
                            <div>
                              <img
                                className="user-image"
                                src={
                                  node.profile_image
                                    ? node.profile_image
                                    : BlankProfileImage
                                }
                              />
                            </div>
                            <div>
                              <h4>{node.name}</h4>
                            </div>
                            <div>
                              <span>{node.designation}</span>
                            </div>
                          </div>
                        </Popover.Content>
                      </Popover>
                    }
                  >
                    <LevelThreeNode>
                      <UserImage
                        src={
                          node.profile_image
                            ? node.profile_image
                            : BlankProfileImage
                        }
                      />
                      <UserInfo>
                        <span className="user-name">{node.name}</span>
                        {/* <span className="user-designation">
                        {node.designation}
                      </span> */}
                      </UserInfo>
                    </LevelThreeNode>
                  </OverlayTrigger>
                )}
                {node.level ===4 && (
                  <OverlayTrigger
                    placement="bottom"
                    trigger="click"
                    rootClose
                    overlay={
                      <Popover>
                        <Popover.Content>
                          <div className="user-details-overlay">
                            <div>
                              <img
                                className="user-image"
                                src={
                                  node.profile_image
                                    ? node.profile_image
                                    : BlankProfileImage
                                }
                              />
                            </div>
                            <div>
                              <h4>{node.name}</h4>
                            </div>
                            <div>
                              <span>{node.designation}</span>
                            </div>
                          </div>
                        </Popover.Content>
                      </Popover>
                    }
                  >
                    <LevelFourNode>
                      <UserImage
                        src={
                          node.profile_image
                            ? node.profile_image
                            : BlankProfileImage
                        }
                      />
                      <UserInfo>
                        <span className="user-name">{node.name}</span>
                        {/* <span className="user-designation">
                        {node.designation}
                      </span> */}
                      </UserInfo>
                    </LevelFourNode>
                  </OverlayTrigger>
                )}
                {node.level ===5 && (
                  <OverlayTrigger
                    placement="bottom"
                    trigger="click"
                    rootClose
                    overlay={
                      <Popover>
                        <Popover.Content>
                          <div className="user-details-overlay">
                            <div>
                              <img
                                className="user-image"
                                src={
                                  node.profile_image
                                    ? node.profile_image
                                    : BlankProfileImage
                                }
                              />
                            </div>
                            <div>
                              <h4>{node.name}</h4>
                            </div>
                            <div>
                              <span>{node.designation}</span>
                            </div>
                          </div>
                        </Popover.Content>
                      </Popover>
                    }
                  >
                    <LevelFiveNode>
                      <UserImage
                        src={
                          node.profile_image
                            ? node.profile_image
                            : BlankProfileImage
                        }
                      />
                      <UserInfo>
                        <span className="user-name">{node.name}</span>
                        {/* <span className="user-designation">
                        {node.designation}
                      </span> */}
                      </UserInfo>
                    </LevelFiveNode>
                  </OverlayTrigger>
                )}
                {node.level >= 6 && (
                  <OverlayTrigger
                    placement="bottom"
                    trigger="click"
                    rootClose
                    overlay={
                      <Popover>
                        <Popover.Content>
                          <div className="user-details-overlay">
                            <div>
                              <img
                                className="user-image"
                                src={
                                  node.profile_image
                                    ? node.profile_image
                                    : BlankProfileImage
                                }
                              />
                            </div>
                            <div>
                              <h4>{node.name}</h4>
                            </div>
                            <div>
                              <span>{node.designation}</span>
                            </div>
                          </div>
                        </Popover.Content>
                      </Popover>
                    }
                  >
                    <LevelSixNode>
                      <UserImage
                        src={
                          node.profile_image
                            ? node.profile_image
                            : BlankProfileImage
                        }
                      />
                      <UserInfo>
                        <span className="user-name">{node.name}</span>
                        {/* <span className="user-designation">
                        {node.designation}
                      </span> */}
                      </UserInfo>
                    </LevelSixNode>
                  </OverlayTrigger>
                )}
              </NodeContainer>
            }
          >
            {node.children &&
              node.children.length ?
              getChildNodes(node.children) : null}
          </TreeNode>
        );
      });
    }
  };

  return (
    <div>
      <Tree
        lineWidth={"2px"}
        lineColor={"green"}
        lineBorderRadius={"5px"}
        label={
          <NodeContainer>
            <TopLevelNode>{nodesTree?.parent?.name}</TopLevelNode>
          </NodeContainer>
        }
      >
        {nodesTree &&
          nodesTree.children &&
          nodesTree.children.map((L1Node, i) => {
            return (
              <TreeNode
                label={
                  <NodeContainer>
                    <OverlayTrigger
                      placement="bottom"
                      trigger="click"
                      rootClose
                      overlay={
                        <Popover>
                          <Popover.Content>
                            <div className="user-details-overlay">
                              <div>
                                <img
                                  className="user-image"
                                  src={
                                    L1Node.profile_image
                                      ? L1Node.profile_image
                                      : BlankProfileImage
                                  }
                                />
                              </div>
                              <div>
                                <h4>{L1Node.name}</h4>
                              </div>
                              <div>
                                <span>{L1Node.designation}</span>
                              </div>
                            </div>
                          </Popover.Content>
                        </Popover>
                      }
                    >
                      <BranchNode>
                        <UserImage
                          src={
                            L1Node.profile_image
                              ? L1Node.profile_image
                              : BlankProfileImage
                          }
                        />
                        <UserInfo>
                          <span className="user-name">{L1Node.name}</span>
                          {/* <span className="user-designation">
                          {L1Node.designation}
                        </span> */}
                        </UserInfo>
                      </BranchNode>
                    </OverlayTrigger>
                  </NodeContainer>
                }
              >
                {getChildNodes(L1Node.children)}
              </TreeNode>
            );
          })}
      </Tree>
    </div>
  );
}

export default OrganisationChart;
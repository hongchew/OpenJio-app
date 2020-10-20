module.exports = {
  types: {
    EXCELLENT_COMMUNICATOR: 'EXCELENT COMMUNICATOR',
    FAST_AND_FURIOUS: 'FAST AND FURIOUS',
    LOCAL_LOBANG: 'LOCAL LOBANG',
    SUPER_NEIGHBOUR: 'SUPER NEIGHBOUR',
  },
  badges: {
    EXCELLENT_COMMUNICATOR: {
      name: 'EXCELLENT COMMUNICATOR',
      badgeType: 'EXCELLENT_COMMUNICATOR',
      description: 'User-awarded badge',
      image: require('../img/excellentCommunicator.png'),
    },
    FAST_AND_FURIOUS: {
      name: 'FAST AND FURIOUS',
      badgeType: 'FAST_AND_FURIOUS',
      description: 'User-awarded badge',
      image: require('../img/fastAndFurious.png'),
    },
    LOCAL_LOBANG: {
      name: 'LOCAL LOBANG',
      badgeType: 'LOCAL_LOBANG',
      description: 'User-awarded badge',
      image: require('../img/localLobang.png'),
    },
    SUPER_NEIGHBOUR: {
      name: 'SUPER NEIGHBOUR',
      badgeType: 'SUPER_NEIGHBOUR',
      description:
        'System-awarded badge, to the user with the highest number of badges for a month',
      image: require('../img/superNeighbour.png'),
    },
  },
};

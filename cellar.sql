--
-- Table structure for table `beer`
--

DROP TABLE IF EXISTS `beer`;

CREATE TABLE `beer` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(65) DEFAULT NULL,
  `year` varchar(6) DEFAULT NULL,
  `score` varchar(6) DEFAULT NULL,
  `location` varchar(95) DEFAULT NULL,
  `description` blob,
  `picture` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=latin1;


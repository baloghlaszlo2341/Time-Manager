-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2024. Máj 04. 00:29
-- Kiszolgáló verziója: 10.4.32-MariaDB
-- PHP verzió: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `taskmanager`
--
CREATE DATABASE IF NOT EXISTS `taskmanager` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `taskmanager`;

-- --------------------------------------------------------

--
-- A nézet helyettes szerkezete `statistics`
-- (Lásd alább az aktuális nézetet)
--
CREATE TABLE `statistics` (
`user` varchar(199)
,`db` bigint(21)
);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `tasks`
--

CREATE TABLE `tasks` (
  `ID` int(11) NOT NULL,
  `date` date NOT NULL,
  `duedate` text NOT NULL,
  `name` text NOT NULL,
  `type` varchar(199) NOT NULL,
  `description` varchar(199) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `tasks`
--

INSERT INTO `tasks` (`ID`, `date`, `duedate`, `name`, `type`, `description`) VALUES
(32, '2024-04-15', '2024-04-16', 'Autómosások', 'Béla', 'cars'),
(33, '2024-04-15', '2024-04-17', 'Autómosás', 'Béla', 'wash the car'),
(34, '2024-04-24', '2024-04-26', 'Software testing', 'Béla', 'Test the new software.'),
(35, '2024-04-24', '2024-04-27', 'Autómosás', 'lackó', 'Mosd le a Skodát'),
(36, '2024-04-29', '2024-04-30', '', 'lackó', ''),
(37, '2024-04-01', '2024-04-28', 'Kertásás', 'lackó', 'wash the car'),
(38, '2024-04-29', '2024-04-30', 'Kertásás', 'Admin', 'köszönj'),
(39, '2024-04-25', '2024-04-28', 'Autómosás', 'Dávid', 'wash the car'),
(40, '2024-04-01', '2024-04-29', 'traktorjavítás', 'Admin', 'repair the engines');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `users`
--

CREATE TABLE `users` (
  `ID` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `passwd` varchar(40) NOT NULL,
  `rights` text NOT NULL,
  `secret` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `users`
--

INSERT INTO `users` (`ID`, `name`, `email`, `passwd`, `rights`, `secret`) VALUES
(1, 'Béla', 'bela@gmail.com', '86f7e437faa5a7fce15d1ddcb9eaeaea377667b8', '', ''),
(3, 'Admin', 'nagyhazi.szabolcs@gmail.com', '5ea345ab330cf29f81d8de9bf5466f508fe351e1', '', ''),
(4, 'lacitest', 'testlaci@turr.hu', '5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8', 'felhasználó', 's2dfsd3fg6sfgfd'),
(5, 'lackó', 'baloghlacko2@gmail.com', '5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8', 'felhasználó', 's2dfsd3fg6sfgfd'),
(6, 'józsi', 'jozsi@gmail.com', 'e0c9035898dd52fc65c41454cec9c4d2611bfb37', 'felhasználó', 's2dfsd3fg6sfgfd'),
(7, 'Dávid', 'david@mail.com', '5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8', 'felhasználó', 's2dfsd3fg6sfgfd');

-- --------------------------------------------------------

--
-- Nézet szerkezete `statistics`
--
DROP TABLE IF EXISTS `statistics`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `statistics`  AS SELECT `tasks`.`type` AS `user`, count(0) AS `db` FROM `tasks` GROUP BY `tasks`.`type` ;

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `tasks`
--
ALTER TABLE `tasks`
  ADD PRIMARY KEY (`ID`);

--
-- A tábla indexei `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`ID`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `tasks`
--
ALTER TABLE `tasks`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT a táblához `users`
--
ALTER TABLE `users`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

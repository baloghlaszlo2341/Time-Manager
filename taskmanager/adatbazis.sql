-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: localhost
-- Létrehozás ideje: 2023. Dec 04. 09:07
-- Kiszolgáló verziója: 10.4.28-MariaDB
-- PHP verzió: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `513SZOFT_weatherforecast`
--
CREATE DATABASE IF NOT EXISTS `513SZOFT_weatherforecast` DEFAULT CHARACTER SET utf8 COLLATE utf8_hungarian_ci;
USE `513SZOFT_weatherforecast`;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `users`
--

CREATE TABLE `users` (
  `ID` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `passwd` varchar(40) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `users`
--

INSERT INTO `users` (`ID`, `name`, `email`, `passwd`) VALUES
(1, 'Béla', 'bela@gmail.com', '86f7e437faa5a7fce15d1ddcb9eaeaea377667b8'),
(3, 'Admin', 'nagyhazi.szabolcs@gmail.com', '5ea345ab330cf29f81d8de9bf5466f508fe351e1');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `weatherdatas`
--

CREATE TABLE `weatherdatas` (
  `ID` int(11) NOT NULL,
  `date` date NOT NULL,
  `min` int(11) NOT NULL,
  `max` int(11) NOT NULL,
  `type` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `weatherdatas`
--

INSERT INTO `weatherdatas` (`ID`, `date`, `min`, `max`, `type`) VALUES
(1, '2023-11-30', 1, 11, 'rainy'),
(2, '2023-12-01', -2, 8, 'cloudy'),
(3, '2023-12-02', -3, 7, 'cloudy'),
(4, '2023-12-03', 2, 13, 'sunny'),
(5, '2023-12-04', 5, 9, 'cloudy'),
(6, '2023-12-05', -3, 10, 'rainy'),
(7, '2023-12-06', -10, 26, 'sunny');

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`ID`);

--
-- A tábla indexei `weatherdatas`
--
ALTER TABLE `weatherdatas`
  ADD PRIMARY KEY (`ID`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `users`
--
ALTER TABLE `users`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT a táblához `weatherdatas`
--
ALTER TABLE `weatherdatas`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

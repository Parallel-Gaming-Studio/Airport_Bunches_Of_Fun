DROP TABLE IF EXISTS [FlyWithButchOhareDB_Copy].[dbo].[abofleaderboard]

CREATE TABLE [FlyWithButchOhareDB_Copy].[dbo].[ABoFLeaderboard]
(
	[entry_id] INT NOT NULL PRIMARY KEY IDENTITY (1, 1), 
    [user] CHAR(2) NOT NULL, 
    [score] INT NOT NULL
)

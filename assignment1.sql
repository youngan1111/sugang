-- 1
SELECT 
    name
FROM
    Pokemon
WHERE
    type = 'Grass'
ORDER BY name;

-- 2
SELECT 
    name
FROM
    Trainer
WHERE
    hometown IN ('Brown city' , 'Rainbow city')
ORDER BY name;

-- 3
SELECT DISTINCT
    type t
FROM
    Pokemon
ORDER BY t;

-- 4
SELECT 
    name
FROM
    City
WHERE
    name LIKE 'B%'
ORDER BY name;

-- 5 
SELECT 
    hometown
FROM
    Trainer
WHERE
    name NOT LIKE 'M%'
ORDER BY hometown;

-- 6 
SELECT 
    nickname
FROM
    CatchedPokemon
WHERE
    level = (SELECT 
            MAX(level)
        FROM
            CatchedPokemon)
ORDER BY nickname;

-- 7
SELECT 
    name
FROM
    Pokemon
WHERE
    name LIKE 'A%' OR name LIKE 'E%'
        OR name LIKE 'I%'
        OR name LIKE 'O%'
        OR name LIKE 'U%'
ORDER BY name;

-- 8
SELECT 
    AVG(level)
FROM
    CatchedPokemon;
    
-- 9
SELECT 
    MAX(c.level)
FROM
    CatchedPokemon c
        LEFT JOIN
    Trainer t ON c.owner_id = t.id
WHERE
    t.name = 'Yellow';
    
-- 10
SELECT DISTINCT
    hometown h
FROM
    Trainer
ORDER BY h;

-- 11
SELECT 
    t.name, c.nickname
FROM
    CatchedPokemon c
        LEFT JOIN
    Trainer t ON c.owner_id = t.id
WHERE
    c.nickname LIKE 'A%'
ORDER BY t.name;

-- 12
SELECT 
    name
FROM
    Trainer
WHERE
    id = (SELECT 
            g.leader_id
        FROM
            City c
                JOIN
            Gym g ON c.name = g.city
        WHERE
            c.description = 'Amazon');
            
-- 13
SELECT 
    owner_id, COUNT(name) cnt
FROM
    CatchedPokemon c
        JOIN
    Pokemon p ON c.pid = p.id
WHERE
    type = 'Fire'
GROUP BY owner_id
HAVING cnt = (SELECT 
        MAX(a.cnt)
    FROM
        (SELECT 
            owner_id, COUNT(name) cnt
        FROM
            CatchedPokemon c
        JOIN Pokemon p ON c.pid = p.id
        WHERE
            type = 'Grass'
        GROUP BY owner_id) a);
    
-- 14
SELECT DISTINCT
    (type)
FROM
    Pokemon
WHERE
    id < 10
GROUP BY type
ORDER BY MAX(id) DESC;

-- 15
SELECT 
    COUNT(*)
FROM
    Pokemon
WHERE
    NOT type = 'Fire';

-- 16
SELECT 
    name
FROM
    Evolution e
        JOIN
    Pokemon p ON e.before_id = p.id
WHERE
    after_id < before_id
ORDER BY name;

-- 17
SELECT 
    AVG(level)
FROM
    CatchedPokemon c
        JOIN
    Pokemon p ON c.pid = p.id
WHERE
    type = 'Water';
    
-- 18
SELECT 
    nickname
FROM
    Gym g
        JOIN
    CatchedPokemon c ON g.leader_id = c.owner_id
WHERE
    level = (SELECT 
            MAX(level)
        FROM
            Gym g
                JOIN
            CatchedPokemon c ON g.leader_id = c.owner_id);
	
-- 19
SELECT 
    name
FROM
    Trainer t
        JOIN
    CatchedPokemon c ON t.id = c.owner_id
WHERE
    hometown = 'Blue City'
GROUP BY owner_id
HAVING AVG(level) = (SELECT 
        MAX(average)
    FROM
        (SELECT 
            AVG(level) average
        FROM
            Trainer t
        JOIN CatchedPokemon c ON t.id = c.owner_id
        WHERE
            hometown = 'Blue City'
        GROUP BY owner_id) a);
        
-- 20
SELECT 
    p.name
FROM
    Trainer t
        JOIN
    CatchedPokemon c ON t.id = c.owner_id
        JOIN
    Pokemon p ON c.pid = p.id
		join
	Evolution e on p.id = e.before_id
WHERE
    hometown IN (SELECT 
            hometown
        FROM
            Trainer
        GROUP BY hometown
        HAVING COUNT(id) = 1)
        AND type = 'Electric';
	
-- 21
SELECT 
    t.name, sum(level) a
FROM
    Gym g
        JOIN
    Trainer t ON g.leader_id = t.id
        JOIN
    CatchedPokemon c ON g.leader_id = c.owner_id
group by leader_id
order by a desc;

-- 22
SELECT 
    hometown
FROM
    Trainer
GROUP BY hometown
HAVING COUNT(id) = (SELECT 
        MAX(cnt)
    FROM
        (SELECT 
            hometown, COUNT(id) cnt
        FROM
            Trainer
        GROUP BY hometown) a);
        
-- 23
SELECT DISTINCT
    p.name
FROM
    CatchedPokemon c
        JOIN
    Trainer t ON c.owner_id = t.id
        JOIN
    Pokemon p ON c.pid = p.id
WHERE
    pid IN (SELECT DISTINCT
            pid
        FROM
            CatchedPokemon c
                JOIN
            Trainer t ON c.owner_id = t.id
        WHERE
            hometown = 'Sangnok City')
        AND hometown = 'Brown City'
ORDER BY p.name;

-- 24
SELECT 
    t.name
FROM
    CatchedPokemon c
        JOIN
    Trainer t ON c.owner_id = t.id
        JOIN
    Pokemon p ON c.pid = p.id
WHERE
    p.name LIKE 'P%'
        AND t.hometown = 'Sangnok City'
ORDER BY t.name;

-- 25
SELECT 
    t.name, p.name
FROM
    CatchedPokemon c
        JOIN
    Trainer t ON c.owner_id = t.id
        JOIN
    Pokemon p ON c.pid = p.id
ORDER BY t.name , p.name;

-- 26
SELECT 
    name
FROM
    Pokemon
WHERE
    id IN (SELECT 
            before_id
        FROM
            Evolution
        WHERE
            before_id NOT IN (SELECT 
                    before_id
                FROM
                    Evolution
                WHERE
                    before_id IN (SELECT 
                            after_id
                        FROM
                            Evolution))
                AND after_id NOT IN (SELECT 
                    before_id
                FROM
                    Evolution
                WHERE
                    before_id IN (SELECT 
                            after_id
                        FROM
                            Evolution)))
ORDER BY name;

-- 27
SELECT 
    c.nickname
FROM
    Gym g
        JOIN
    CatchedPokemon c ON g.leader_id = c.owner_id
        JOIN
    Pokemon p ON c.pid = p.id
WHERE
    g.city = 'Sangnok City'
        AND p.type = 'Water'
order by c.nickname;

-- 28
SELECT 
	t.name
FROM
    CatchedPokemon c
        JOIN
    Trainer t ON c.owner_id = t.id
        JOIN
    Evolution e ON c.pid = e.after_id
group by t.name
having count(c.id) > 2
order by t.name;

-- 29
SELECT 
    p.name
FROM
    Pokemon p
        LEFT JOIN
    CatchedPokemon c ON p.id = c.pid
WHERE
    owner_id IS NULL
ORDER BY p.name;

-- 30
SELECT 
    MAX(level) m
FROM
    CatchedPokemon c
        JOIN
    Trainer t ON c.owner_id = t.id
GROUP BY hometown
ORDER BY m DESC;

-- 31            
SELECT 
    e.before_id first,
    (SELECT 
            name
        FROM
            Pokemon
        WHERE
            id = e.before_id) firstName,
    (SELECT 
            name
        FROM
            Pokemon
        WHERE
            id = second) secondName,
    (SELECT 
            name
        FROM
            Pokemon
        WHERE
            id = third) thirdName
FROM
    Evolution e
        LEFT JOIN
    (SELECT 
        before_id second, after_id third
    FROM
        Evolution
    WHERE
        before_id IN (SELECT 
                after_id
            FROM
                Evolution)) a ON e.after_id = a.second
WHERE
    third IS NOT NULL
ORDER BY first;

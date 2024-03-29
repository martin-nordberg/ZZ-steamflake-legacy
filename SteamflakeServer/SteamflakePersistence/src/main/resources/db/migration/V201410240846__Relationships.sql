
----------------------------
-- Abstract Relationships --
----------------------------

-- Table
CREATE TABLE RELATIONSHIP (
    ID UUID NOT NULL,
    TYPE VARCHAR(128) NOT NULL  -- TBD: foreign key to reference table or else Java enum
);

-- Primary key
ALTER TABLE RELATIONSHIP ADD CONSTRAINT PK_RELATIONSHIP
    PRIMARY KEY (ID);


----------------------------
-- Namespace Containments --
----------------------------

-- Table
CREATE TABLE NAMESPACE_CONTAINMENT (
    ID UUID NOT NULL,
    CONTAINING_NAMESPACE_ID UUID NOT NULL,
    CONTAINED_NAMESPACE_ID UUID NOT NULL,
    DESTROYED BOOLEAN NOT NULL DEFAULT FALSE
);

-- Primary key
ALTER TABLE NAMESPACE_CONTAINMENT ADD CONSTRAINT PK_NAMESPACE_CONTAINMENT
    PRIMARY KEY (ID);

-- Inheritance
ALTER TABLE NAMESPACE_CONTAINMENT ADD CONSTRAINT PFK_NAMESPACE_CONTAINMENT__RELATIONSHIP
    FOREIGN KEY (ID) REFERENCES RELATIONSHIP(ID) ON DELETE CASCADE;

-- Foreign keys
ALTER TABLE NAMESPACE_CONTAINMENT ADD CONSTRAINT FK_NAMESPACE_CONTAINMENT__CONTAINING_NAMESPACE
    FOREIGN KEY (CONTAINING_NAMESPACE_ID) REFERENCES ABSTRACT_NAMESPACE(ID) ON DELETE CASCADE;
ALTER TABLE NAMESPACE_CONTAINMENT ADD CONSTRAINT FK_NAMESPACE_CONTAINMENT__CONTAINED_NAMESPACE
    FOREIGN KEY (CONTAINED_NAMESPACE_ID) REFERENCES NAMESPACE(ID) ON DELETE CASCADE;

-- Unique containing namespace per contained namespace
ALTER TABLE NAMESPACE_CONTAINMENT ADD CONSTRAINT UQ_NAMESPACE_CONTAINMENT__CONTAINED_NAMESPACE
    UNIQUE (CONTAINED_NAMESPACE_ID);

-- View
CREATE VIEW V_NAMESPACE_CONTAINMENT AS
SELECT ID,
       CONTAINING_NAMESPACE_ID,
       CONTAINED_NAMESPACE_ID
  FROM NAMESPACE_CONTAINMENT
 WHERE DESTROYED = FALSE;

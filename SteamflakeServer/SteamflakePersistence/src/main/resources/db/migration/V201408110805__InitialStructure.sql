

-- Create a table of abstract model elements
CREATE TABLE MODEL_ELEMENT (
    UUID CHAR(36) NOT NULL
);

ALTER TABLE MODEL_ELEMENT ADD CONSTRAINT PK_MODEL_ELEMENT PRIMARY KEY (UUID);


-- Create a table of namespaces
CREATE TABLE NAMESPACE (
    UUID CHAR(36) NOT NULL,
    NAME VARCHAR(128) NOT NULL,
    SUMMARY VARCHAR(256) NULL
);

ALTER TABLE NAMESPACE ADD CONSTRAINT PK_NAMESPACE PRIMARY KEY (UUID);

ALTER TABLE NAMESPACE ADD CONSTRAINT FK_NAMESPACE_MODEL_ELEMENT
  FOREIGN KEY (UUID) REFERENCES MODEL_ELEMENT(UUID) ON DELETE CASCADE;


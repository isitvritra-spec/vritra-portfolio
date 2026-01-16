---
title: "When to Break the Rules: Database Normalization in Practice"
excerpt: "When to Break the Rules: Database Normalization in Practice"
publishedDate: "2025-05-23"
category: "AI"
readTime: "6"
image: "https://cdn-images-1.medium.com/max/800/1*l0WBz8arVRfV1GLN4B1RuA.png"
---

The three normal forms are the most fundamental design principles in database modeling. So, what exactly are the three normal forms? And in real-world development, must we strictly adhere to them? In this article, let’s discuss this topic in depth.

[https://isitvritra101.medium.com/when-to-break-the-rules-database-normalization-in-practice-71404e63bd26?sk=f7803002271c839ff0933b7c7e6bb800](https://isitvritra101.medium.com/when-to-break-the-rules-database-normalization-in-practice-71404e63bd26?sk=f7803002271c839ff0933b7c7e6bb800)

## The Three Normal Forms

## 1. First Normal Form (1NF: Ensuring Atomicity in Each Column)

The First Normal Form requires that each field (column) in every table must be atomic, meaning the values in each field cannot be further divided. In other words, each field can only store a single value — it cannot contain sets, arrays, or repeating groups.

For example, consider the following student table:

In this table, the Phone Number field contains multiple numbers, which violates 1NF’s requirement for atomicity. To comply with 1NF, phone numbers should be separated into individual records or moved to a new table.

## Design after conforming to 1NF:

### Student Table

---

## 2. Second Normal Form (2NF: Every Column Must Depend on the Entire Primary Key)

The Second Normal Form requires that the table already satisfy 1NF and eliminates partial dependencies — non-primary-key fields must depend on the entire primary key, not just part of it. This typically applies to tables with composite primary keys.

**For example**, consider the following **OrderDetail** table:

In this table, the composite primary key is (Order ID, Product ID). The Product Name and Unit Price depend only on Product ID, not the entire primary key, resulting in partial dependency — which violates 2NF.

## Design after conforming to 2NF:

### OrderDetail Table

### Product Table

## 3. Third Normal Form (3NF: Eliminate Transitive Dependencies)

The Third Normal Form requires that the table already satisfy 2NF and eliminates transitive dependencies — non-primary-key fields should not depend on other non-primary-key fields. In other words, every non-primary-key field must directly depend on the primary key, not indirectly through another non-primary-key field.

For example, consider the following Employee table:

In this table, Department Name depends on Department ID, which in turn depends on the primary key (Employee ID), forming a transitive dependency — violating 3NF.

Design after conforming to 3NF:

### Employee Table

### Department Table

By moving the department information to a separate table, the transitive dependency is eliminated, and the database structure conforms to the Third Normal Form.

To summarize, the three normal forms are:

- **1NF**: Ensure each field holds atomic values.
- **2NF**: Eliminate partial dependencies — every non-key field must depend on the whole primary key.
- **3NF**: Eliminate transitive dependencies — non-key fields should depend only on the primary key.

## Violating the Three Normal Forms

In practice, while following the three normal forms (1NF, 2NF, 3NF) improves data consistency and reduces redundancy, there are cases where violating them can be beneficial — to improve performance, simplify design, or meet specific business requirements.

Below are common reasons and examples for intentionally violating normal forms:

## Performance Optimization

In high-concurrency and large-scale applications, strictly following the normal forms may result in frequent join operations, which can increase query time and system load. To improve performance, designers may denormalize data to reduce joins.

For example, in an e-commerce system with `Orders` and `Users` tables, a strictly 3NF design would store only the `User ID` in the `Orders` table and require a join to retrieve user details.

To improve query performance, we might redundantly store user name and address in the `Orders` table to avoid joining the `Users` table.

### Design after violating 3NF:

## Simplifying Queries and Development

Strict normalization may result in complex database schemas, making development and maintenance more difficult. To simplify logic and reduce development effort, appropriate redundancy may be introduced.

For instance, in a content management system (CMS), the `Articles` and `Categories` tables are usually separate. If category names are frequently queried with articles, a join adds complexity. Storing the category name directly in the `Articles` table simplifies frontend logic.

### Design after violating 3NF:

## Reporting and Data Warehousing

In data warehouses and reporting systems, fast reads and aggregations are critical. To optimize performance, denormalized structures are often used, such as star or snowflake schemas — which don’t comply with strict normal forms.

For example, a sales data warehouse might have a fact table that includes dimension data for fast report generation.

### Design after violating 3NF:

Here, storing product name and category directly avoids joins with dimension tables, boosting report generation efficiency.

## Special Business Requirements

Some business scenarios require fast responses for specific queries or operations. Appropriate redundancy helps meet these demands.

For example, in a real-time trading system, to quickly calculate account balances, we might store the current balance in the `Users` table rather than calculate it on the fly from transaction records.

### Design after violating 3NF:

Although transaction details are stored elsewhere, maintaining a `Current Balance` in the user table avoids costly runtime computations.

## Balancing Read and Write Performance

In systems where read operations significantly outnumber writes, redundancy is sometimes accepted to improve read performance — even if it increases write complexity.

For instance, social media platforms display a user’s friend count on their profile. Calculating this every time is inefficient. Instead, the friend count is stored directly in the `Users` table.

### Design after violating 3NF:

This allows for fast display without real-time computation.

## Fast Iteration and Flexibility

Startups or fast-evolving products often need flexible and quickly adjustable databases. Over-normalization may hinder speed and adaptability. Redundant design can improve development speed and agility.

For example, in an early-stage e-commerce platform, shipping addresses might be stored directly in the `Orders` table instead of using a separate `Addresses` table.

### Design after violating 3NF:

This simplifies development and supports quick product rollout. Normalization can be applied later as needed.

## Reducing Complexity and Improving Comprehensibility

Excessive normalization may make a schema hard to understand and maintain. Moderate redundancy can simplify the design and improve team understanding and communication.

For instance, in a school management system, splitting class info across multiple tables can be confusing. To simplify, class name and homeroom teacher may be stored directly in the `Students` table.

### Design after violating 3NF:

By storing `Class Name` and `Homeroom Teacher` directly, table count is reduced and design is simplified.

## Summary

In this article, we’ve analyzed the three normal forms of database design along with examples. They serve as foundational principles for designing relational databases. However, in real-world projects, due to performance needs, simplified design, rapid iteration, or specific business logic, we often do not strictly follow them.

> Ultimately, system architecture is a trade-off — among business requirements, data consistency, performance, and development efficiency. We must make practical design decisions based on our application context.

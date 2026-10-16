---
headline: "Knight Capital's order router sent millions of unintended orders in 45 minutes"
eventDate: "2012-08-01"
added: "2026-10-16"
summary: >-
  On August 1, 2012, Knight Capital Americas' automated order router, SMARS, sent millions of orders into the market over about 45 minutes while processing 212 small retail orders, obtaining more than 4 million executions in 154 stocks for more than 397 million shares, according to the SEC's order. New code had been installed on seven of SMARS's eight servers; the eighth still held an old, unused function called Power Peg, which the new code's repurposed flag set off. Knight ended the morning with an unintended position of about $3.5 billion long in 80 stocks and about $3.15 billion short in 74 stocks. The SEC puts the loss at more than $460 million, and Knight agreed to pay a $12 million penalty for violating the market access rule.
missingLayer: knowing
missingLayerLine: >-
  Before the open, an internal system sent 97 automated emails flagging "Power Peg disabled." The SEC says Knight did not design them as system alerts, personnel generally did not review them, and they were not acted on before the open or used to diagnose the problem afterward.
why: >-
  The information that something was wrong existed inside the firm before the market opened, in a form no one was assigned to read. A fast system kept acting on it for 45 minutes while the people responsible were still trying to find the cause.
grade: A
caveats:
  - "The loss figures differ by source. The SEC's order says Knight lost more than $460 million. Knight's own statement of August 2, 2012 reported a realized pre-tax loss of about $440 million. The documents read for this entry do not reconcile the two."
  - "The 97 emails were not designed as alerts. The SEC says they gave Knight a potential opportunity to identify the problem; it does not say anyone was told the problem was serious."
tags: [finance, software-deployment]
sources:
  - label: "In the Matter of Knight Capital Americas LLC, Order Instituting Administrative and Cease-and-Desist Proceedings (Release No. 34-70694)"
    publisher: "U.S. Securities and Exchange Commission"
    url: "https://www.sec.gov/files/litigation/admin/2013/34-70694.pdf"
    date: "2013-10-16"
    primary: true
  - label: "SEC Charges Knight Capital With Violating Market Access Rule (2013-222)"
    publisher: "U.S. Securities and Exchange Commission"
    url: "https://www.sec.gov/news/press-release/2013-222"
    date: "2013-10-16"
    primary: true
  - label: "Knight Capital Group statement (Form 8-K, Exhibit 99.1)"
    publisher: "Knight Capital Group, via SEC EDGAR"
    url: "https://www.sec.gov/Archives/edgar/data/0001060749/000119312512332176/d391111dex991.htm"
    date: "2012-08-02"
    primary: true
---

## What happened

Knight changed its software to take part in the New York Stock Exchange's Retail Liquidity Program, which began on August 1, 2012. The new code was meant to replace an old function in the order router called Power Peg, which Knight had stopped using years earlier but had left in place, and it reused the flag that used to switch Power Peg on [[1]](#src-1).

Starting July 27, Knight deployed the new code in stages. One technician did not copy it to one of the eight servers. No second technician reviewed the deployment, and Knight had no written procedure requiring one [[1]](#src-1).

On August 1, orders carrying the repurposed flag reached the eighth server and set off the old Power Peg code. In 2005 Knight had moved the part of that code that counted how much of an order was already filled, and had not retested it. The server therefore kept sending child orders for each incoming order without regard to how much had already been executed. One part of Knight's system recognized the orders as filled, but that information was not communicated to the router [[1]](#src-1).

The result was more than 4 million executions in 154 stocks, more than 397 million shares, in about 45 minutes [[1]](#src-1). The SEC says the executions moved prices: in 75 stocks Knight's trading was more than 20 percent of volume and contributed to price moves above five percent, and other market participants received less favorable prices in some cases and more favorable ones in others [[1]](#src-1).

Knight's August 2 statement attributed the orders to a technology problem related to installing trading software [[3]](#src-3).

## Where the knowing was missing

Beginning around 8:01 a.m. ET, an internal system generated automated emails, called BNET rejects, that referenced the router and an error described as "Power Peg disabled." It sent 97 of them to a group of Knight personnel before the 9:30 a.m. open. The SEC says Knight did not design these messages as system alerts and personnel generally did not review them, but that they were sent in real time, were caused by the deployment failure, and gave Knight a potential opportunity to find and fix the problem before the open. They were not acted on before the open and were not used to diagnose the problem afterward [[1]](#src-1).

While Knight's technology staff worked to find the cause, the firm stayed connected to the markets and kept sending orders [[1]](#src-1).

## The outcome

The SEC's order finds that Knight violated Rule 15c3-5, the market access rule, which requires controls reasonably designed to limit the risks of market access, including from automated systems. It was the SEC's first enforcement action under that rule. Knight agreed to pay a $12 million penalty and to retain an independent consultant to review its controls [[1]](#src-1) [[2]](#src-2).
